# app/db/session.py
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1) Pull in DATABASE_URL (e.g. postgresql://user:pass@host/db or sqlite:///./file_meta.db)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./file_meta.db")

# 2) Create engine in “future” mode with pool pre-ping
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    pool_pre_ping=True,
    future=True,
)

# 3) Configure sessionmaker
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,  # keep objects usable after commit
    future=True,
)

# 4) Base class for models
Base = declarative_base()

# 5) FastAPI dependency
def get_db():
    """
    Yield a SQLAlchemy Session, ensure it’s closed after use.
    Usage:
        def endpoint(db: Session = Depends(get_db))
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
