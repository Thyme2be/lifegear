from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from schemas.auth import Token, User
from services.auth import authenticate_user
from core.security import create_access_token, get_current_active_user
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter()


# --- Login route ---
@router.post("/login")
def login(
    response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="none",
        secure=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # in seconds
    )

    return {"success": True} # Token(access_token=access_token, token_type="bearer")

@router.get("/check")
async def auth_check(current_user: Annotated[User, Depends(get_current_active_user)]):
    return {"success": True}


@router.get("/users/home", response_model=User)
async def read_users_home(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user