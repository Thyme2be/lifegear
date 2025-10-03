from fastapi import APIRouter, Depends, HTTPException, status
from crud.activity import create_activity
from core.security import get_current_user
from schemas.activity import ActivityCreate
from schemas.auth import User


activity_router = APIRouter()

@activity_router.post("/add")
async def add_activity(
    activity: ActivityCreate,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to add activities"
        )

    try:
        new_id = create_activity(activity, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"id": new_id, "message": "Activity created successfully", "success": True}
