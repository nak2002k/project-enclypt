import hashlib, uuid
from sqlalchemy.orm import Session
from .models import User, FileMeta

# file‐size caps (per file and total‐usage)
PER_FILE_CAP = {
    "guest":   25 * 1024 * 1024,
    "account": 100 * 1024 * 1024,
    "paid":    None,
}
TOTAL_CAP = PER_FILE_CAP  # same for demo

def get_user_by_email(db: Session, email: str) -> User|None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_license(db: Session, key: str) -> User|None:
    return db.query(User).filter(User.license_key == key).first()

def create_user(db: Session, email: str, pwd_hash: str, tier: str="account") -> User:
    user = User(
        email=email,
        password_hash=pwd_hash,
        license_key=uuid.uuid4().hex,
        tier=tier
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def sum_user_usage(db: Session, user: User) -> int:
    tot = db.query(FileMeta.file_size).filter(FileMeta.user_id==user.id).all()
    return sum(sz for (sz,) in tot)

def create_file_meta(
    db: Session,
    user: User,
    filename: str,
    content: bytes,
    method: str
) -> FileMeta:
    h = hashlib.sha256(content).hexdigest()
    meta = FileMeta(
        user_id      = user.id,
        filename     = filename,
        file_size    = len(content),
        content_hash = h,
        method       = method
    )
    db.add(meta)
    db.commit()
    db.refresh(meta)
    return meta
