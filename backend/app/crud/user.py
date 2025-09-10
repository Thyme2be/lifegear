from db import supabase


def get_user(username: str):
    return (
        supabase.table("users")
        .select("*")
        .eq("student_id", username)
        .execute()
    )


def create_user(username: str, hashed_password: str):
    return (
        supabase.table("users")
        .insert({"student_id": username, "password": hashed_password})
        .execute()
    )
