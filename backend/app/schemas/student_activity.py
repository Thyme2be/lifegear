from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class StudentActivityCreate(BaseModel):
    activity_id: UUID


class StudentActivityResponse(BaseModel):
    title: str
    start_at: datetime
    end_at: datetime
