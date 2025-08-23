from fastapi import APIRouter, Response, Depends, HTTPException, Cookie
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from schemas.student import studentLogin
from crud import register_student, query_student_id
from core.security import verify_password
from datetime import datetime, timezone, timedelta
from jose import jwt, JWTError
import os

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

# Load env variables
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


# --- Register route ---
@router.post("/register")
def register_user(req: studentLogin):
    try:
        register_student(req.studentId, req.password)
        return {"success": True, "message": "User registered successfully"}

    except Exception as e:
        if "duplicate key value violates unique constraint" in str(e):
            return {"success": False, "message": "User already exists"}
        return {"success": False, "message": "Unexpected error", "error": str(e)}


# --- Login route ---
@router.post("/login")
def login(req: studentLogin, res: Response):
    # Query Supabase for the student
    result = query_student_id(req.studentId)

    # Check if student exists
    if not result.data or len(result.data) == 0:
        return {"success": False, "message": "Student ID not found"}

    hashed_password = result.data[0]["password"]

    # Verify password
    if not verify_password(req.password, hashed_password):
        return {"success": False, "message": "Student ID or Password Incorrect"}

    # Generate JWT
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = jwt.encode(
        {"studentId": req.studentId, "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    # Set HTTP-only cookie
    res.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
    )

    return {"success": True, "message": "Login successful"}


# --- Dependency to get current user ---
def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        studentId = payload.get("studentId")
        if studentId is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return studentId
    except JWTError:
        raise HTTPException(status_code=401, detail="JWT ERROR Invalid token")

# --- Logout route (optional) ---
@router.post("/logout")
def logout(res: Response):
    res.delete_cookie("access_token")
    return {"success": True, "message": "Logged out successfully"}
