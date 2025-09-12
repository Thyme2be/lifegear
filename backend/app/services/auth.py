from types import SimpleNamespace
from crud.user import create_user, get_user
from core.security import verify_password, get_hash_password

def authenticate_user(username: str, password: str):
    user = get_user(username).data
    if not user:
        return False
    if not verify_password(password, user[0]["password"]):
        return False
    
    return user[0]

def register_student(username: int, password: str):
    # You might add checks here, e.g., if user already exists before calling create_user
    hashed_password = get_hash_password(password)
    return create_user(username, hashed_password)