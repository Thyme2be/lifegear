from pydantic import (
    BaseModel,
    Field,
    ValidationInfo,
    field_validator,
    model_validator,
)
from typing import Optional, Dict
from datetime import datetime
from uuid import UUID
from .enums import ActivityStatus, ActivityCategory, ContactType


class ActivityCreate(BaseModel):
    title: str
    description: str
    start_at: datetime
    end_at: datetime
    location_text: str
    contact_info: Dict[ContactType, str]
    status: ActivityStatus
    image_path: str | None = None
    category: ActivityCategory

    @model_validator(mode="before")
    @classmethod
    def check_at_least_one_contact(cls, values):
        if not values.get("contact_info"):
            raise ValueError("At least one contact information must be provided.")
        return values

    @field_validator("end_at")
    @classmethod
    def validate_activity_date(cls, v: datetime, info: ValidationInfo):
        if "start_at" in info.data and v < info.data["start_at"]:
            raise ValueError("end_at must be after start_at")
        return v


class ActivityUpdateForm(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    location_text: Optional[str] = None
    contact_info: Optional[Dict[ContactType, str]] = None
    image_path: Optional[str] = None
    status: Optional[ActivityStatus] = None
    category: Optional[ActivityCategory] = None


class ActivityThumbnailResponse(BaseModel):
    id: UUID
    title: str
    image_path: Optional[str] = None
    start_at: datetime
    status: ActivityStatus
    category: ActivityCategory


class ActivityResponse(BaseModel):
    id: UUID
    created_by: UUID
    title: str
    description: Optional[str] = None
    start_at: datetime
    end_at: datetime
    location_text: Optional[str] = None
    contact_info: Optional[Dict[ContactType, str]] = {}
    image_path: Optional[str] = None
    status: ActivityStatus
    category: ActivityCategory
    created_at: datetime
    updated_at: datetime
