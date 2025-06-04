import os
import uuid
from pathlib import Path
from base64 import urlsafe_b64decode, urlsafe_b64encode
from typing import Literal

from cryptography.fernet import InvalidToken, Fernet
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import padding as asym_padding

from app.encryptor import (
    TEMP_DIR,
    PBKDF2_ITERS,
    derive_key,
    sanitize_filename,
    validate_method,
)

# Ensure temp dir exists
TEMP_DIR.mkdir(parents=True, exist_ok=True, mode=0o700)


def fernet_decrypt(token: bytes, password: str) -> bytes:
    """
    Decrypt a Fernet token that was prefixed with a 16-byte salt.
    """
    if len(token) < 17:
        raise ValueError("Invalid token format.")
    salt = token[:16]
    token_body = token[16:]
    # Derive same key
    key = urlsafe_b64decode(urlsafe_b64encode(derive_key(password, salt)))
    try:
        return Fernet(urlsafe_b64encode(derive_key(password, salt))).decrypt(token_body)
    except InvalidToken:
        raise ValueError("Fernet decryption failed: invalid key or corrupted data.")


def aes256_decrypt(data: bytes, password: str) -> bytes:
    """
    Decrypt AES-256-GCM data prefixed with 16-byte salt and 12-byte nonce.
    """
    if len(data) < 16 + 12 + 16:
        raise ValueError("Invalid ciphertext format.")
    salt = data[:16]
    nonce = data[16:28]
    ct = data[28:]
    # Derive key
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=PBKDF2_ITERS,
    )
    key = kdf.derive(password.encode())
    aesgcm = AESGCM(key)
    try:
        return aesgcm.decrypt(nonce, ct, None)
    except Exception:
        raise ValueError("AES-256 decryption failed: invalid key or corrupted data.")


def rsa_decrypt(data: bytes, private_key_pem: str) -> bytes:
    """
    Decrypt data encrypted with RSA-OAEP + SHA256.
    """
    try:
        private_key = serialization.load_pem_private_key(
            private_key_pem.encode(),
            password=None,
        )
    except Exception:
        raise ValueError("Invalid RSA private key format.")

    try:
        return private_key.decrypt(
            data,
            asym_padding.OAEP(
                mgf=asym_padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None,
            ),
        )
    except Exception:
        raise ValueError("RSA decryption failed: invalid key or corrupted data.")


async def decrypt_file(
    file,
    password: str,
    method: Literal["fernet", "aes256", "rsa"],
    user_level: Literal["guest", "account", "paid"],
    rsa_private_key: str = None
) -> str:
    """
    Read the uploaded encrypted file, decrypt it based on the method and user tier,
    and write the plaintext to a temporary file, returning its path.
    """
    # Check permissions
    validate_method(method, user_level)

    content = await file.read()

    if method == "fernet":
        plaintext = fernet_decrypt(content, password)
    elif method == "aes256":
        plaintext = aes256_decrypt(content, password)
    elif method == "rsa":
        if not rsa_private_key:
            raise ValueError("RSA private key required for RSA decryption.")
        plaintext = rsa_decrypt(content, rsa_private_key)
    else:
        raise ValueError("Unsupported decryption method.")

    # Sanitize and write output
    safe_name = sanitize_filename(file.filename or "decrypted.bin")
    out_name = f"dec_{uuid.uuid4().hex}_{safe_name}"
    out_path = TEMP_DIR / out_name

    with open(out_path, "wb") as f_out:
        f_out.write(plaintext)

    return str(out_path)
