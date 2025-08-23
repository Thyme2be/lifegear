from db import supabase
from core.security import hash_password


def register_student(studentId: int, password: str):
    supabase.table("students").insert(
        {"student_id": studentId, "password": hash_password(password)}
    ).execute()


def query_student_id(studentId: int):
    return supabase.table("students").select("password").eq("student_id", studentId).execute()
