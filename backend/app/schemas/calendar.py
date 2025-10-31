from typing import List
from pydantic import BaseModel
from datetime import date

from schemas.student_class import StudentClassDaily
from schemas.student_activity import StudentActivityResponse


class DailyScheduleResponse(BaseModel):
    date: date
    classes: List[StudentClassDaily]  # Using List[Any] as it matches your `[dict(record)...]`
    activities: List[StudentActivityResponse]
