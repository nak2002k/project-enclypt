import logging
from functools import lru_cache

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models import User

logger = logging.getLogger(__name__)

# Cache validation results for a short time to reduce DB load
@lru_cache(maxsize=1024)
def is_valid_key(license_key: str) -> bool:
    """
    Verify that the provided license key exists and is active.
    Returns True if valid, False otherwise.
    """
    try:
        with SessionLocal() as db:  # SQLite thread-safe session
            user = db.query(User).filter(
                User.license_key == license_key,
                User.is_active == True,
            ).first()
            valid = bool(user)
            if not valid:
                logger.warning("License validation failed for key: %s", license_key)
            return valid
    except Exception as e:
        logger.error("Error checking license key: %s", e)
        # On DB error, treat as invalid to be safe
        return False


def get_user_tier(license_key: str) -> str:
    """
    Return the user tier ('guest', 'account', 'paid') associated with the license key.
    Raises HTTPException(401) if invalid or inactive.
    """
    with SessionLocal() as db:
        user = db.query(User).filter(
            User.license_key == license_key,
            User.is_active == True,
        ).first()
        if not user:
            logger.warning("Attempt to fetch tier for invalid key: %s", license_key)
            raise HTTPException(status_code=401, detail="Invalid license key")
        return user.tier.lower()
