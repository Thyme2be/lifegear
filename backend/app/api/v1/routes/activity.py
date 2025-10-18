from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from api.v1.dependencies import get_activity_form
from services.activity_service import check_activity_exist
from crud.activity import (
    create_activity,
    get_all_detailed_activities,
    get_all_thumbnail_activities,
    delete_activity,
    get_activity_dates,
    update_activity,
)
from core.security import get_current_user, get_current_active_user
from schemas.activity import (
    ActivityCreate,
    ActivityCategory,
    ActivityStatus,
    ActivityThumbnailResponse,
    ActivityUpdateForm,
    ActivityResponse,
    ContactType,
)
from schemas.auth import User
from pydantic import ValidationError
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timezone
import json


activity_router = APIRouter()


# Temp Debug
# @activity_router.post("/debug", status_code=status.HTTP_200_OK)
# async def debug_form_upload(title: str = Form(...), image_file: UploadFile = File(...)):
#     """
#     A simple endpoint to debug form and file uploads.
#     """
#     print("--- DEBUG ENDPOINT HIT ---")
#     print(f"Title received: {title}")
#     print(f"Image filename received: {image_file.filename}")
#     print(f"Image content type: {image_file.content_type}")

#     return {
#         "message": "Debug endpoint received data successfully!",
#         "received_title": title,
#         "received_filename": image_file.filename,
#     }


@activity_router.post("/", status_code=status.HTTP_201_CREATED)
async def add_activity(
    title: str = Form(...),
    description: str = Form(...),
    start_at: datetime = Form(...),
    end_at: datetime = Form(...),
    location_text: str = Form(...),
    contact_info: str = Form(...),
    status: ActivityStatus = Form(...),
    category: ActivityCategory = Form(...),
    image_path: str = Form(None),
    image_file: UploadFile = File(None),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to add activities",
        )

    try:
        # Step 1: Load the JSON string into a Python dict
        loaded_contact_info = json.loads(contact_info)

        # Step 2: Convert string keys to ContactType enum members
        contact_info_data = {
            ContactType(key): value for key, value in loaded_contact_info.items()
        }
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid contact_info: {e}")

    try:
        activity = ActivityCreate(
            title=title,
            description=description,
            start_at=start_at,
            end_at=end_at,
            location_text=location_text,
            contact_info=contact_info_data,
            status=status,
            category=category,
            image_path=image_path,
        )
    except ValidationError as e:
        # Pydantic's validation error is more specific
        raise HTTPException(status_code=422, detail=e.errors())
    try:
        new_id = await create_activity(activity, image_file, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "id": new_id,
        "message": "Activity created successfully",
        "success": True,
    }


# Endpoint for thumbnail-only activities
@activity_router.get("/thumbnails", response_model=List[ActivityThumbnailResponse])
def read_thumbnail_activities(
    current_active_user: User = Depends(get_current_active_user),
):
    try:
        activities = get_all_thumbnail_activities()
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint for full detailed activities
# @activity_router.get("/", response_model=List[ActivityResponse])
# def read_detailed_activities(
#     current_active_user: User = Depends(get_current_active_user),
# ):
#     try:
#         activities = get_all_detailed_activities()
#         return activities
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# Update Data
@activity_router.patch("/{activity_id}", response_model=ActivityResponse)
async def edit_activity(
    activity_id: UUID,
    form_data: ActivityUpdateForm = Depends(get_activity_form),
    image_file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update activities",
        )

    existing_activity_date = get_activity_dates(str(activity_id))
    if not existing_activity_date:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found",
        )

    if not existing_activity_date:
        raise HTTPException(status_code=404, detail="Activity date details not found")

    existing_activity = ActivityUpdateForm(**existing_activity_date)

    # Date validation
    start_at = form_data.start_at if form_data.start_at else existing_activity.start_at
    if start_at and start_at.tzinfo is None:
        start_at = start_at.replace(tzinfo=timezone.utc)
    else:
        start_at = existing_activity.start_at

    end_at = form_data.end_at if form_data.end_at else existing_activity.end_at
    if end_at and end_at.tzinfo is None:
        end_at = end_at.replace(tzinfo=timezone.utc)
    else:
        end_at = existing_activity.end_at

    if end_at < start_at:
        raise HTTPException(
            status_code=422,
            detail=[
                {"loc": ["body", "end_at"], "msg": "end_at must be after start_at"}
            ],
        )

    update_data = form_data.model_dump(
        mode="json", exclude_unset=True, exclude_none=True
    )

    # The `contact_info` from the form is a string, we need to parse it.
    if "contact_info" in update_data and isinstance(update_data["contact_info"], str):
        try:
            loaded_contact_info = json.loads(update_data["contact_info"])
            update_data["contact_info"] = {
                ContactType(k): v for k, v in loaded_contact_info.items()
            }
        except (json.JSONDecodeError, ValueError) as e:
            raise HTTPException(status_code=400, detail=f"Invalid contact_info: {e}")

    updated_activity = await update_activity(str(activity_id), update_data, image_file)
    return updated_activity


@activity_router.delete("/{activity_id}", status_code=status.HTTP_200_OK)
def remove_activity(activity_id: UUID, current_user: User = Depends(get_current_user)):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete activities",
        )
    try:
        deleted_activity = delete_activity(str(activity_id))
        if not deleted_activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Activity with id {activity_id} not found",
            )
        return {"message": "Activity deleted successfully", "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
