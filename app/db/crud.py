import hashlib
from sqlalchemy.orm import Session
from .models import User, FileMeta

# per-file and total caps
TIER_SIZE_LIMITS = {
    "guest":   25 * 1024 * 1024,
    "account": 100 * 1024 * 1024,
    "paid":    None,
}

def get_user_by_key(db: Session, license_key: str) -> User | None:
    return db.query(User).filter(
        User.license_key == license_key,
        User.is_active == 1
    ).first()

def create_user(db: Session, license_key: str, tier: str = "guest") -> User:
    user = User(license_key=license_key, tier=tier)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def sum_user_usage(db: Session, user: User) -> int:
    rows = db.query(FileMeta.file_size).filter(FileMeta.user_id == user.id).all()
    return sum(size for (size,) in rows)

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
