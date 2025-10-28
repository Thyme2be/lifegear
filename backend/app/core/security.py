from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from typing import Annotated
from fastapi import Depends, HTTPException, Request, status
from passlib.context import CryptContext
from schemas.auth import TokenData, User
from jwt.exceptions import InvalidTokenError
from core.config import SECRET_KEY, ALGORITHM
from crud.user import get_user
import jwt

# Create CryptContext (bcrypt is the default algorithm here)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hash_password(password: str) -> str:
    """Hash the password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception

    # Remove unneccessary data
    user_data_dict = {
        k: v for k, v in user.data[0].items() if k not in ["password", "created_at"]
    }  # Omit password and created_at

    return User(**user_data_dict)


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.is_active:
        return current_user
    raise HTTPException(status_code=400, detail="Inactive user")
