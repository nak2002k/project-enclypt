from fastapi import APIRouter, Depends, FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.db.session import SessionLocal, engine, Base
from app.db.crud import (
    get_user_by_key, create_user,
    sum_user_usage, create_file_meta, TIER_SIZE_LIMITS
)
from app.encryptor import encrypt_file
from app.decryptor import decrypt_file
from app.keycheck import is_valid_key, get_user_tier

# auto-create tables on startup
Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(
    license_key: str = Form(...),
    tier: str = Form("guest"),
    db: Session = Depends(get_db)
):
    if get_user_by_key(db, license_key):
        raise HTTPException(400, "Key already registered")
    if tier not in ("guest","account","paid"):
        raise HTTPException(400, "Invalid tier")
    user = create_user(db, license_key, tier)
    return {"license_key": user.license_key, "tier": user.tier}

@router.post("/encrypt")
async def encrypt_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    key: str = Form(...),
    method: str = Form("fernet"),
    rsa_public_key: str = Form(None),
    db: Session = Depends(get_db)
):
    # 1) Auth
    user = get_user_by_key(db, key)
    if not user:
        raise HTTPException(401, "Invalid license key")
    tier = user.tier

    # 2) Size checks
    content = await file.read()
    size    = len(content)
    cap     = TIER_SIZE_LIMITS[tier]
    if cap and size > cap:
        raise HTTPException(403, f"{tier} single-file cap exceeded")
    if tier == "guest" and cap and sum_user_usage(db, user) + size > cap:
        raise HTTPException(403, "Guest total-usage cap exceeded")
    await file.seek(0)

    # 3) Encrypt
    try:
        out_path = await encrypt_file(
            file              = file,
            password          = key,
            method            = method,
            rsa_public_key    = rsa_public_key
        )
    except PermissionError as e:
        raise HTTPException(403, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception:
        raise HTTPException(500, "Encryption failed")

    # 4) Log metadata
    with open(out_path, "rb") as f:
        data = f.read()
    create_file_meta(db, user, file.filename, data, method)

    # 5) Return & cleanup
    resp = FileResponse(
        path     = out_path,
        filename = f"encrypted_{file.filename}",
        media_type="application/octet-stream"
    )
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
    user = get_user_by_key(db, key)
    if not user:
        raise HTTPException(401, "Invalid license key")

    # Decrypt
    try:
        out_path = await decrypt_file(
            file             = file,
            password         = key,
            method           = method,
            rsa_private_key  = rsa_private_key
        )
    except PermissionError as e:
        raise HTTPException(403, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception:
        raise HTTPException(500, "Decryption failed")

    # Log metadata
    with open(out_path, "rb") as f:
        data = f.read()
    create_file_meta(db, user, file.filename, data, f"decrypt:{method}")

    resp = FileResponse(
        path      = out_path,
        filename  = f"decrypted_{file.filename}",
        media_type="application/octet-stream"
    )
    background_tasks.add_task(os.remove, out_path)
    return resp

app = FastAPI()
app.include_router(router, prefix="/api")
