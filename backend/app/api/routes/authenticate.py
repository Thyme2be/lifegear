from fastapi import APIRouter, HTTPException
from schemas.student import studentLogin
from crud import register_student, query_student_id
from core.security import verify_password


router = APIRouter(
    prefix="/authenticate",
    tags=["authenticate"],
    responses={404: {"description": "Not found"}},
)


# Register route
@router.post("/register")
def register_user(req: studentLogin):

    # Insert into Supabase
    try:
        register_student(req.studentId, req.password)
        return {"message": "User registered successfully"}

    except Exception as e:
        if "duplicate key value violates unique constraint" in str(e):
            raise HTTPException(status_code=400, detail="User already exists")
        raise HTTPException(status_code=500, detail="Unexpected error")


@router.post("/login")
def login(req: studentLogin):

    # Query Supabase for the student
    response = query_student_id(req.studentId)

    # Check if student exists
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=400, detail="Student ID not found")

    hashed_password = response.data[0]["password"]

    # Verify password
    if verify_password(req.password, hashed_password):
        return {"success": True, "message": "Login successful"}
    else:
        raise HTTPException(status_code=400, detail="Student ID or Password Incorrect")
