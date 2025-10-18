from typing import Literal
from uuid import UUID
from pydantic import BaseModel


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    id: UUID
    username: str
    first_name_th: str | None = None
    last_name_th: str | None = None
    is_active: bool | None = None
    role: Literal["student", "officer", "admin"]


class UserRegister(BaseModel):
    username: str
    password: str
    first_name_th: str | None = None
    last_name_th: str | None = None
