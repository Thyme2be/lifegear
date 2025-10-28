from datetime import date, time
from typing import List, Optional
import uuid

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ClassMeetingIn(BaseModel):
    weekday: int = Field(..., ge=0, le=6, description="0=Sunday..6=Saturday")
    start_time: time
    end_time: time
    repeat_rule: Optional[str] = "weekly"

    @model_validator(mode="after")
    def check_time_order(self):
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self


class StudentClassIn(BaseModel):
    student_id: str
    class_code: str
    class_name: str
    class_start_date: date
    class_end_date: date
    location: Optional[str] = None
    section: Optional[str] = None
    notes: Optional[str] = None
    meetings: List[ClassMeetingIn] = Field(default_factory=list)


class ClassCancellationIn(BaseModel):
    class_meeting_id: uuid.UUID
    cancellation_date: date
    reason: str | None = None


class StudentClassDaily(BaseModel):
    class_code: str
    class_name: str
    start_time: time
    end_time: time


class DailyClassResponse(BaseModel):
    date: date
    classes: List[StudentClassDaily]
