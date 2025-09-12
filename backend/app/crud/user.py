from db import supabase


def get_user(username: str):
    return (
        supabase.table("users")
        .select("*")
        .eq("username", username)
        .execute()
    )


def create_user(username: str, hashed_password: str):
    return (
        supabase.table("users")
        .insert({"username": username, "password": hashed_password})
        .execute()
    )
