import io
import os
import sys
from pathlib import Path
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.encryptor import encrypt_file
from app.decryptor import decrypt_file

class AsyncBytesIO(io.BytesIO):
    async def read(self, *args):
        return super().read(*args)

    async def seek(self, offset, whence=0):
        return super().seek(offset, whence)


@pytest.mark.asyncio
@pytest.mark.parametrize("method", ["fernet", "aes256"])
async def test_encrypt_decrypt_sym(method):
    data = b"secret data"
    src = AsyncBytesIO(data)
    src.filename = "data.bin"

    enc_path = await encrypt_file(
        file=src,
        password="pw",
        method=method,
        user_level="paid",
    )
    with open(enc_path, "rb") as f:
        enc_data = f.read()

    enc_file = AsyncBytesIO(enc_data)
    enc_file.filename = os.path.basename(enc_path)

    dec_path = await decrypt_file(
        file=enc_file,
        password="pw",
        method=method,
        user_level="paid",
    )
    with open(dec_path, "rb") as f:
        plain = f.read()

    assert plain == data

    os.remove(enc_path)
    os.remove(dec_path)


@pytest.mark.asyncio
async def test_encrypt_decrypt_rsa():
    data = b"hello world"
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()

    priv_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()
    pub_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode()

    src = AsyncBytesIO(data)
    src.filename = "data.bin"

    enc_path = await encrypt_file(
        file=src,
        password="irrelevant",
        method="rsa",
        user_level="paid",
        rsa_public_key=pub_pem,
    )
    with open(enc_path, "rb") as f:
        enc_data = f.read()

    enc_file = AsyncBytesIO(enc_data)
    enc_file.filename = os.path.basename(enc_path)

    dec_path = await decrypt_file(
        file=enc_file,
        password="irrelevant",
        method="rsa",
        user_level="paid",
        rsa_private_key=priv_pem,
    )
    with open(dec_path, "rb") as f:
        plain = f.read()

    assert plain == data

    os.remove(enc_path)
    os.remove(dec_path)
