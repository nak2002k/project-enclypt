from fastapi import (
    APIRouter, Depends, UploadFile, File, Form,
    HTTPException, BackgroundTasks
)
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import os

from .db.session      import SessionLocal, engine, Base
from .db.crud         import (
    get_user_by_email, create_user,
    sum_user_usage, create_file_meta, PER_FILE_CAP, TOTAL_CAP
)
from .encryptor       import encrypt_file
from .decryptor       import decrypt_file
from .auth            import (
    hash_pwd, authenticate_user,
    create_access_token, get_current_user,
    ACCESS_EXPIRE
)

Base.metadata.create_all(bind=engine)
router = APIRouter()

@router.post("/register")
def register(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(lambda: SessionLocal())
):
    if get_user_by_email(db, email):
        raise HTTPException(400, "Email already registered")
    user = create_user(db, email, hash_pwd(password), tier="account")
    return {"email": user.email, "license_key": user.license_key, "tier": user.tier}

@router.post("/token")
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(lambda: SessionLocal())
):
    user = authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(401, "Invalid credentials")
    access_token = create_access_token({"sub": user.license_key})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/encrypt")
async def encrypt_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    method: str = Form("fernet"),
    rsa_public_key: str = Form(None),
    user=Depends(get_current_user),
    db: Session = Depends(lambda: SessionLocal())
):
    tier = user.tier

    # read + size check
    content = await file.read()
    size    = len(content)
    cap     = PER_FILE_CAP[tier]
    if cap and size > cap:
        raise HTTPException(403, f"{tier} single-file cap exceeded")
    if tier=="guest" and TOTAL_CAP[tier] and sum_user_usage(db, user)+size > TOTAL_CAP[tier]:
        raise HTTPException(403, "Guest total-usage cap exceeded")
    await file.seek(0)

    # encrypt
    try:
        out = await encrypt_file(
            file=file,
            password=user.license_key,
            method=method,
            user_level=user.tier,
            rsa_public_key=rsa_public_key,
        )
    except PermissionError as e:
        raise HTTPException(403, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
    except:
        raise HTTPException(500, "Encryption failed")

    # log
    with open(out,"rb") as f:
        data = f.read()
    create_file_meta(db, user, file.filename, data, method)

    # return + cleanup
    resp = FileResponse(out, filename=f"encrypted_{file.filename}")
    background_tasks.add_task(os.remove, out)
    return resp

@router.post("/decrypt")
async def decrypt_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    method: str = Form("fernet"),
    rsa_private_key: str = Form(None),
    user=Depends(get_current_user),
    db: Session = Depends(lambda: SessionLocal())
):
    # online‐only decrypt for account & paid
    if user.tier not in ("account","paid"):
        raise HTTPException(403, "Guests cannot decrypt online")

    try:
        out = await decrypt_file(
            file=file,
            password=user.license_key,
            method=method,
            user_level=user.tier,
            rsa_private_key=rsa_private_key,
        )
    except ValueError as e:
        raise HTTPException(400, str(e))
    except:
        raise HTTPException(500, "Decryption failed")

    with open(out,"rb") as f:
        data = f.read()
    create_file_meta(db, user, file.filename, data, f"decrypt:{method}")

    resp = FileResponse(out, filename=f"decrypted_{file.filename}")
    background_tasks.add_task(os.remove, out)
    return resp

@router.get("/dashboard")
def dashboard(user=Depends(get_current_user), db: Session = Depends(lambda: SessionLocal())):
    # return your file metadata + hidden license_key
    files = [
        {
            "filename": m.filename,
            "size":     m.file_size,
            "method":   m.method,
            "timestamp": m.timestamp.isoformat()
        }
        for m in user.files
    ]
    return {
        "email":        user.email,
        "tier":         user.tier,
        "license_key":  "••••••••••••" ,
        "can_show_key": True,
        "files":        files
    }

@router.get("/dashboard/key")
def get_license_key(user=Depends(get_current_user)):
    return {"license_key": user.license_key}

@router.get("/dashboard/json")
def dashboard_json(user=Depends(get_current_user)):
    from app.json_store import get_entries
    return {"files": get_entries(user.license_key)}
