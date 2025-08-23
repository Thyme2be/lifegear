from pydantic import BaseModel

class studentLogin(BaseModel):
    studentId: int
    password: str