from datetime import datetime
import json
from typing import Optional

from fastapi import File, Form, HTTPException, UploadFile
from pydantic import ValidationError

from schemas.activity import ActivityUpdateForm
from schemas.enums import ActivityCategory, ActivityStatus


def get_activity_form(
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    start_at: Optional[datetime] = Form(None),
    end_at: Optional[datetime] = Form(None),
    location_text: Optional[str] = Form(None),
    contact_info: Optional[str] = Form(None),
    status: Optional[ActivityStatus] = Form(None),
    category: Optional[ActivityCategory] = Form(None),
    image_path: Optional[str] = Form(None),
) -> ActivityUpdateForm:
    
    parsed_contact_info = None
    
    if contact_info:    
        try:
            # **FIX: Parse the JSON string into a dictionary**
            parsed_contact_info = json.loads(contact_info)
        except json.JSONDecodeError:
            # If parsing fails, the client sent malformed JSON
            raise HTTPException(
                status_code=400,
                detail="Invalid format for contact_info. It must be a valid JSON string.",
            )

    try:
        return ActivityUpdateForm(
            title=title,
            description=description,
            start_at=start_at,
            end_at=end_at,
            location_text=location_text,
            contact_info=parsed_contact_info, # parsed_contact_info
            status=status,
            category=category,
            image_path=image_path,
        )

    except ValidationError as e:
        # Pydantic's validation error is more specific
        raise HTTPException(status_code=422, detail=e.errors())
