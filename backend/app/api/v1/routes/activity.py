from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, status
from crud.activity import (
    create_activity,
    get_all_detailed_activities,
    get_all_thumbnail_activities,
    delete_activity,
    update_activity,
)
from core.security import get_current_user, get_current_active_user
from schemas.activity import (
    ActivityCreate,
    ActivityThumbnailResponse,
    ActivityUpdate,
    ActivityResponse,
)
from schemas.auth import User
from typing import List, Optional
from uuid import UUID


activity_router = APIRouter()


@activity_router.post("/", status_code=status.HTTP_201_CREATED)
def add_activity(
    activity: ActivityCreate,
    current_user: User = Depends(get_current_user),
    image_file: UploadFile = Form(...),
):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to add activities",
        )

    try:
        new_id = create_activity(activity, image_file, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"id": new_id, "message": "Activity created successfully", "success": True}


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
@activity_router.get("/", response_model=List[ActivityResponse])
def read_detailed_activities(
    current_active_user: User = Depends(get_current_active_user),
):
    try:
        activities = get_all_detailed_activities()
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@activity_router.patch("/{activity_id}", response_model=ActivityResponse)
def edit_activity(
    activity_id: UUID,
    activity_update: ActivityUpdate,
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update activities",
        )

    try:
        updated_activity = update_activity(str(activity_id), activity_update)
        if not updated_activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Activity with id {activity_id} not found",
            )
        return updated_activity[0]
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
