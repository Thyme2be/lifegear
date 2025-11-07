from datetime import date
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from schemas.student_activity import StudentActivityResponse, StudentActivityCreate
from crud.student_activity import (
    create_student_activity,
    get_daily_activity,
    get_monthly_activities_crud,
)

from core.security import get_current_active_user
from schemas.auth import User


student_activity_router = APIRouter()


# WAIT FOR DELETE
@student_activity_router.get(
    "/daily",
    response_model=List[StudentActivityResponse],
    summary="Get student's activities for today",
)
def get_today_activities(current_user: User = Depends(get_current_active_user)):
    try:
        today = date.today()
        activities = get_daily_activity(user_id=current_user.id, target_date=today)
        return activities
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


# MIGRATE TO THIS API
@student_activity_router.get(
    "/{target_date}",
    response_model=List[StudentActivityResponse],
    summary=f"Get student's activities for a specific date",
)
def get_specific_date_activities(
    target_date: date, current_user: User = Depends(get_current_active_user)
):
    try:
        activities = get_daily_activity(
            user_id=current_user.id, target_date=target_date
        )
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@student_activity_router.get("/monthly")
def get_monthly_activities(current_user: User = Depends(get_current_active_user)):
    try:
        activities = get_monthly_activities_crud(user_id=current_user.id)
        return activities
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@student_activity_router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Add an activity to the current student's list",
)
def add_student_activity(
    payload: StudentActivityCreate,
    current_user: User = Depends(get_current_active_user),
):

    try:
        new_id = create_student_activity(
            student_id=current_user.id, activity_id=payload.activity_id
        )

        return {
            "id": new_id,
            "message": "Activity added successfully",
            "success": True,
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
