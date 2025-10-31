from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status

from schemas.calendar import DailyScheduleResponse
from crud.student_activity import get_daily_activity
from crud.student_class import get_daily_classes
from core.security import get_current_active_user
from schemas.auth import User

calendar_router = APIRouter()


@calendar_router.get("/daily")
async def get_daily_schedule(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access their daily schedule",
        )

    today = date.today()

    try:
        classes_list_records = await get_daily_classes(current_user, today)
        classes_list_dicts = [dict(record) for record in classes_list_records]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching daily classes: {e}",
        )

    try:
        # This function is synchronous, so no await
        activities_list = get_daily_activity(user_id=current_user.id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching daily activities: {e}",
        )

    return DailyScheduleResponse(
        date=today, classes=classes_list_dicts, activities=activities_list
    )
