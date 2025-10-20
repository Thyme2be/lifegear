from db import supabase
from schemas.auth import UserRegister


def get_user(username: str):
    return (
        supabase.table("users")
        .select("*")
        .eq("username", username)
        .execute()
    )


def create_user(user: UserRegister):

    response = supabase.table("users").insert({
            "username": user.username,
            "password": user.password,
            "first_name_th": user.first_name_th,
            "last_name_th": user.last_name_th,
            "is_active": True
    }).execute()

    return response.data  # returns the inserted row(s)

