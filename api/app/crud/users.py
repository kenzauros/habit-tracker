from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.security import hash_password
from app.models.user import User


def get_user_by_id(db: Session, user_id: str) -> User | None:
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    normalized = email.strip().lower()
    return db.scalar(select(User).where(User.email == normalized))


def create_user(db: Session, email: str, password: str) -> User:
    user = User(email=email.strip().lower(), password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
