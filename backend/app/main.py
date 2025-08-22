import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from utils.security import hash_password, verify_password

# Load .env file
load_dotenv()

app = FastAPI()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


class studentLogin(BaseModel):
    studentId: int
    password: str


# Register route
@app.post("/register")
def register_user(req: studentLogin):

    # Insert into Supabase
    try:
        supabase.table("students").insert(
            {"student_id": req.studentId, "password": hash_password(req.password)}
        ).execute()

        return {"message": "User registered successfully"}

    except Exception as e:
        if "duplicate key value violates unique constraint" in str(e):
            raise HTTPException(status_code=400, detail="User already exists")
        raise HTTPException(status_code=500, detail="Unexpected error")


@app.post("/login")
def login(req: studentLogin):

    # Query Supabase for the student
    response = (
        supabase.table("students")
        .select("password")
        .eq("student_id", req.studentId)
        .execute()
    )

    # Check if student exists
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=400, detail="Student ID not found")

    hashed_password = response.data[0]["password"]

    # Verify password
    if verify_password(req.password, hashed_password):
        return {"success": True, "message": "Login successful"}
    else:
        raise HTTPException(status_code=400, detail="Student ID or Password Incorrect")
