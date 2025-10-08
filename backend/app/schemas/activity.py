from fastapi import Form
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict
from datetime import datetime
from uuid import UUID
from .enums import ActivityStatus, ActivityCategory

import json


class ActivityCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    start_at: datetime
    end_at: datetime
    location_text: Optional[str] = None
    contact_info: Optional[dict] = {}
    image_path: Optional[str] = None
    status: ActivityStatus
    category: ActivityCategory

    @field_validator("end_at")
    def validate_end_after_start(cls, v, info):
        start_at = info.data.get("start_at")
        if start_at and v <= start_at:
            raise ValueError("end_at must be after start_at")
        return v

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        description: Optional[str] = Form(None),
        start_at: datetime = Form(...),
        end_at: datetime = Form(...),
        location_text: Optional[str] = Form(None),
        contact_info: Optional[str] = Form(None),
        status: ActivityStatus = Form(...),
        category: ActivityCategory = Form(...),
    ):
        parsed_contact = json.loads(contact_info) if contact_info else {}
        return cls(
            title=title,
            description=description,
            start_at=start_at,
            end_at=end_at,
            location_text=location_text,
            contact_info=parsed_contact,
            status=status,
            category=category,
        )


class ActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    location_text: Optional[str] = None
    contact_info: Optional[Dict[str, str]] = None
    image_path: Optional[str] = None
    status: Optional[ActivityStatus] = None
    category: Optional[ActivityCategory] = None

    # The start_at/end_at validation will be handled in the CRUD layer
    # where we have access to the existing activity data.


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
    contact_info: Optional[Dict[str, str]] = {}
    image_path: Optional[str] = None
    status: ActivityStatus
    category: ActivityCategory
    created_at: datetime
    updated_at: datetime
