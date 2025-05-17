import os
import uuid
import secrets
from pathlib import Path
from base64 import urlsafe_b64encode
from typing import Literal

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import padding as asym_padding

# ---------------- Config ----------------
TEMP_DIR = Path("temp_files")
TEMP_DIR.mkdir(parents=True, exist_ok=True, mode=0o700)
PBKDF2_ITERS = 200_000

ALLOWED_METHODS = {
    "guest":   ["fernet"],
    "account": ["fernet", "aes256"],
    "paid":    ["fernet", "aes256", "rsa"],
}

# Size limits per tier (bytes)
TIER_FILE_SIZE_LIMITS = {
    "guest":   25 * 1024 * 1024,    # 25 MB
    "account": 100 * 1024 * 1024,   # 100 MB (adjustable)
    "paid":    None,
}

# ------------- Helpers ------------------
def validate_method(method: str, user_level: str):
    if method not in ALLOWED_METHODS.get(user_level.lower(), []):
        raise PermissionError(f"{user_level=} can’t use {method=}")


def sanitize_filename(name: str) -> str:
    base = Path(name).name
    return "".join(c for c in base if c.isalnum() or c in ("-", "_", "."))


def derive_key(password: str, salt: bytes, length: int = 32) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=length,
        salt=salt,
        iterations=PBKDF2_ITERS,
    )
    return kdf.derive(password.encode())

# ------------- Encryption ---------------
def fernet_encrypt(data: bytes, password: str) -> bytes:
    salt = secrets.token_bytes(16)
    key = urlsafe_b64encode(derive_key(password, salt))
    token = Fernet(key).encrypt(data)
    return salt + token


def aes256_encrypt(data: bytes, password: str) -> bytes:
    salt = secrets.token_bytes(16)
    key = derive_key(password, salt)
    nonce = secrets.token_bytes(12)
    aesgcm = AESGCM(key)
    ct = aesgcm.encrypt(nonce, data, None)
    return salt + nonce + ct


def rsa_encrypt(data: bytes, public_key_pem: str) -> bytes:
    try:
        public_key = serialization.load_pem_public_key(
            public_key_pem.encode(),
        )
    except Exception:
        raise ValueError("Invalid RSA public key.")
    return public_key.encrypt(
        data,
        asym_padding.OAEP(
            mgf=asym_padding.MGF1(hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

# --------- Main API Function ----------
async def encrypt_file(
    file,
    password: str,
    method: Literal["fernet", "aes256", "rsa"],
    user_level: Literal["guest", "account", "paid"],
    rsa_public_key: str = None
) -> str:
    validate_method(method, user_level)

    content = await file.read()

    # enforce tier-specific size limits
    size_limit = TIER_FILE_SIZE_LIMITS.get(user_level.lower())
    if size_limit is not None and len(content) > size_limit:
        raise ValueError(f"File size exceeds {size_limit // (1024*1024)} MB limit for {user_level} tier")

    if method == "fernet":
        encrypted = fernet_encrypt(content, password)
    elif method == "aes256":
        encrypted = aes256_encrypt(content, password)
    elif method == "rsa":
        if not rsa_public_key:
            raise ValueError("Missing RSA public key.")
        encrypted = rsa_encrypt(content, rsa_public_key)
    else:
        raise ValueError("Unsupported method.")

    safe_name = sanitize_filename(file.filename or "")
    out_name = f"{uuid.uuid4().hex}_{safe_name}"
    out_path = TEMP_DIR / out_name

    with open(out_path, "wb") as f:
        f.write(encrypted)

    return str(out_path)
