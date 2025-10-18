from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from crud.user import create_user
from schemas.auth import User, UserRegister
from services.auth import authenticate_user
from core.security import (
    create_access_token,
    get_current_active_user,
    get_hash_password,
)
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

auth_router = APIRouter()


# --- Login route ---
@auth_router.post("/login")
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

    return {"success": True}


@auth_router.post("/register")
async def register_user(user: UserRegister):
    try:
        # Hash password before storing
        hashed_pw = get_hash_password(user.password)

        # Insert into your custom "users" table
        create_user(
            UserRegister(
                username=user.username,
                password=hashed_pw,
                first_name_th=user.first_name_th,
                last_name_th=user.last_name_th,
            )
        )

        return {"message": "User registered successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@auth_router.get("/check")
async def auth_check(current_user: Annotated[User, Depends(get_current_active_user)]):
    return {"success": True}


@auth_router.get("/user/home", response_model=User)
async def read_users_home(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@auth_router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="none",
        secure=True,
    )
    return {"message": "Logged out successfully"}
