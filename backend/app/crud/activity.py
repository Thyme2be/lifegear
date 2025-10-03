from uuid import uuid4
from datetime import datetime, timezone
from db.base import supabase
from schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse
from typing import List, Dict, Any


def create_activity(activity: ActivityCreate, created_by: str) -> str:
    """
    Inserts a new activity into the database.
    Returns the UUID of the new activity.
    """
    new_id = str(uuid4())
    data = {
        "id": new_id,
        "created_by": created_by,
        "title": activity.title,
        "description": activity.description,
        "start_at": activity.start_at.isoformat(),
        "end_at": activity.end_at.isoformat(),
        "location_text": activity.location_text,
        "contact_info": activity.contact_info,
        "image_path": activity.image_path,
        "status": activity.status.value,
        "category": activity.category.value,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    response = supabase.table("activities").insert(data).execute()
    if not response.data:
        raise Exception(f"Insert failed: {response}")

    return new_id


def get_all_activities() -> ActivityResponse:
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


def update_activity(id: str, activity_update: ActivityUpdate) -> List[Dict[str, Any]]:
    """
    Updates an activity in the database.
    """
    # Fetch existing activity to validate start_at/end_at
    existing_activity_res = supabase.table("activities").select("start_at, end_at").eq("id", id).execute()
    if not existing_activity_res.data:
        return [] # Not found

    existing_activity = existing_activity_res.data[0]

    update_data = activity_update.model_dump(exclude_unset=True)

    # Pydantic model_dump gives datetime objects. The DB returns strings.
    # We need to parse them to datetime objects for comparison.
    start_at_str = update_data.get("start_at")
    if start_at_str:
        start_at = start_at_str if isinstance(start_at_str, datetime) else datetime.fromisoformat(start_at_str)
    else:
        start_at = datetime.fromisoformat(existing_activity["start_at"])

    end_at_str = update_data.get("end_at")
    if end_at_str:
        end_at = end_at_str if isinstance(end_at_str, datetime) else datetime.fromisoformat(end_at_str)
    else:
        end_at = datetime.fromisoformat(existing_activity["end_at"])

    if end_at <= start_at:
        raise ValueError("end_at must be after start_at")

    # Convert enums to their string values for DB update
    if "status" in update_data and update_data["status"]:
        update_data["status"] = update_data["status"].value
    if "category" in update_data and update_data["category"]:
        update_data["category"] = update_data["category"].value

    # Convert datetimes back to isoformat strings for Supabase
    if "start_at" in update_data and isinstance(update_data["start_at"], datetime):
        update_data["start_at"] = update_data["start_at"].isoformat()
    if "end_at" in update_data and isinstance(update_data["end_at"], datetime):
        update_data["end_at"] = update_data["end_at"].isoformat()

    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    response = supabase.table("activities").update(update_data).eq("id", id).execute()
    return response.data


def delete_activity(id):
    response = supabase.table("activities").delete().eq("id", id).execute()
    if not response.data:
        return []
    return response.data
