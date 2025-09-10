from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    first_name_th: str | None = None
    last_name_th: str | None = None
    is_active: bool | None = None
