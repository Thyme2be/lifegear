from uuid import uuid4
from datetime import datetime, timezone

from fastapi import HTTPException, UploadFile
from services.activity_service import (
    delete_activity_image,
    move_activity_image,
    upload_activity_image,
)
from db.base import supabase
from schemas.activity import (
    ActivityCreate,
    ActivityResponse,
    ActivityThumbnailResponse,
    ActivityUpdateForm,
)


async def create_activity(
    activity: ActivityCreate, image_file: UploadFile, created_by: str
) -> str:
    """
    Inserts a new activity into the database.
    Returns the UUID of the new activity.
    """
    new_id = str(uuid4())

    img_public_url = activity.image_path
    if not img_public_url and image_file:
        img_public_url = await upload_activity_image(
            activity.category.value, activity.title, image_file, image_file.filename
        )

    data = {
        "id": new_id,
        "created_by": created_by,
        "title": activity.title,
        "description": activity.description,
        "start_at": activity.start_at.isoformat(),
        "end_at": activity.end_at.isoformat(),
        "location_text": activity.location_text,
        "contact_info": activity.contact_info,
        "image_path": img_public_url,
        "status": activity.status.value,
        "category": activity.category.value,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    response = supabase.table("activities").insert(data).execute()
    if not response.data:
        raise Exception(f"Insert failed: {response}")

    return new_id


def get_all_detailed_activities() -> ActivityResponse:
    """
    Retrieves all activities from the database, ordered by creation date.
    """
    response = (
        supabase.table("activities")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    if not response.data:
        return []
    return response.data


def get_all_thumbnail_activities() -> ActivityThumbnailResponse:
    response = (
        supabase.table("activities")
        .select("id, title, image_path, start_at, status, category")
        .order("start_at", desc=True)
        .execute()
    )
    if not response.data:
        return []
    return response.data


def get_activity_dates(activity_id: str) -> dict | None:
    """
    Retrieves start_at and end_at for a single activity by its ID.
    """

    response = (
        supabase.table("activities")
        .select("start_at, end_at")
        .eq("id", activity_id)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]


async def update_activity(
    activity_id: str, update_data: dict, image_file: UploadFile | None
) -> ActivityUpdateForm:
    """
    Updates an activity in the database.
    """
    hasCategory = True if "category" in update_data else False
    hasTitle = True if "title" in update_data else False

    if image_file:
        # delete the exists one
        # delete_activity_image(activity_id)

        if not hasCategory:
            # fetch a category
            catagory_old = (
                supabase.table("activities")
                .select("category")
                .eq("id", activity_id)
                .execute()
            )

        update_data["category"] = (
            update_data["category"] if hasCategory else catagory_old.data[0]["category"]
        )
        update_data["title"] = update_data["title"] if hasTitle else image_file.filename

        # create a new one
        img_public_url = await upload_activity_image(
            update_data["category"],
            update_data["title"],
            image_file,
            image_file.filename,
        )
        update_data["image_path"] = img_public_url

        if hasCategory:
            move_activity_image(activity_id, update_data["category"])

    if hasCategory and (not image_file):
        move_activity_image(activity_id, update_data["category"])

    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    response = (
        supabase.table("activities").update(update_data).eq("id", activity_id).execute()
    )

    return response.data[0]


def delete_activity(id):
    delete_activity_image(id)
    response = supabase.table("activities").delete().eq("id", id).execute()
    if not response.data:
        return []
    return response.data
