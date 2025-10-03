from uuid import uuid4
from datetime import datetime, timezone
from db.base import supabase
from schemas.activity import ActivityCreate


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
