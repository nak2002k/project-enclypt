from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .db.session import SessionLocal
from .db.crud    import get_user_by_email, get_user_by_license

# SECRET – replace with env var in prod
SECRET_KEY    = "CHANGE_THIS_SECRET"
ALGORITHM     = "HS256"
ACCESS_EXPIRE = timedelta(hours=2)

pwd_ctx   = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2    = OAuth2PasswordBearer(tokenUrl="/api/token")

def hash_pwd(pw: str) -> str:
    return pwd_ctx.hash(pw)

def verify_pwd(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow()+ACCESS_EXPIRE})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_pwd(password, user.password_hash):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    creds_exc = HTTPException(
        status_code=401, detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise creds_exc
    except JWTError:
        raise creds_exc

    user = get_user_by_license(db, sub)
    if not user or not user.is_active:
        raise creds_exc
    return user
