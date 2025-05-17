from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, BigInteger
)
from sqlalchemy.orm import relationship
from .session import Base

class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    email         = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    license_key   = Column(String, unique=True, nullable=False)
    tier          = Column(String, nullable=False)  # "guest","account","paid"
    is_active     = Column(Integer, default=1)
    created_at    = Column(DateTime, default=datetime.utcnow)

    files = relationship("FileMeta", back_populates="owner")

class FileMeta(Base):
    __tablename__ = "file_metadata"
    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename     = Column(String, nullable=False)
    file_size    = Column(BigInteger, nullable=False)
    content_hash = Column(String, nullable=False)
    method       = Column(String, nullable=False)
    timestamp    = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="files")
