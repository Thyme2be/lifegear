from pydantic import BaseModel

class studentLogin(BaseModel):
    studentId: str
    password: str