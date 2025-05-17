# app/api.py

from fastapi import APIRouter, FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.encryptor import encrypt_file, TIER_FILE_SIZE_LIMITS
from app.decryptor import decrypt_file
from app.keycheck  import is_valid_key, get_user_tier
from app.db.session import SessionLocal
from app.db.crud    import sum_user_usage, create_file_meta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/encrypt")
async def encrypt_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    key: str = Form(...),
    method: str = Form("fernet"),
    rsa_public_key: str = Form(None),
    db: Session = Depends(get_db)
):
    # 1) Auth & tier
    if not is_valid_key(key):
        raise HTTPException(401, "Invalid key")
    tier = get_user_tier(key)

    # 2) Guest usage cap
    if tier == "guest":
        content = await file.read()
        if sum_user_usage(db, key) + len(content) > TIER_FILE_SIZE_LIMITS["guest"]:
            raise HTTPException(403, "Guest cap of 25 MB hit")
        await file.seek(0)

    # 3) Encrypt
    try:
        out_path = await encrypt_file(
            file=file, password=key,
            method=method, user_level=tier,
            rsa_public_key=rsa_public_key
        )
    except PermissionError as e:
        raise HTTPException(403, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    except:
        raise HTTPException(500, "Encryption failed")

    # 4) Log metadata
    with open(out_path, "rb") as f:
        data = f.read()
    create_file_meta(
        db=db,
        license_key=key,
        filename=file.filename,
        file_size=len(data),
        content_hash=hashlib.sha256(data).hexdigest(),
        method=method
    )

    # 5) Return & cleanup
    resp = FileResponse(out_path, filename=f"encrypted_{file.filename}")
    background_tasks.add_task(os.remove, out_path)
    return resp

@router.post("/decrypt")
async def decrypt_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    key: str = Form(...),
    method: str = Form("fernet"),
    rsa_private_key: str = Form(None),
    db: Session = Depends(get_db)
):
    if not is_valid_key(key):
        raise HTTPException(401, "Invalid key")
    tier = get_user_tier(key)

    # Decrypt
    try:
        out_path = await decrypt_file(
            file=file, password=key,
            method=method, user_level=tier,
            rsa_private_key=rsa_private_key
        )
    except PermissionError as e:
        raise HTTPException(403, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    except:
        raise HTTPException(500, "Decryption failed")

    # Log metadata (optional)
    with open(out_path, "rb") as f:
        data = f.read()
    create_file_meta(
        db=db,
        license_key=key,
        filename=file.filename,
        file_size=len(data),
        content_hash=hashlib.sha256(data).hexdigest(),
        method=f"decrypt:{method}"
    )

    resp = FileResponse(out_path, filename=f"decrypted_{file.filename}")
    background_tasks.add_task(os.remove, out_path)
    return resp

app = FastAPI()
app.include_router(router, prefix="/api")
