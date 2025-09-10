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
@router.post("/token")
def login(
    response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["student_id"]}, expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # in seconds
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get("/users/home", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):

    user_obj = User(
        username=current_user["student_id"],
        first_name_th=current_user.get("first_name_th"),
        last_name_th=current_user.get("last_name_th"),
        is_active=current_user.get("is_active"),
    )

    return user_obj
