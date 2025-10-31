from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from crud.student_class import (
    cancel_student_class_crud,
    create_student_class_crud,
    get_daily_classes,
)
from core.security import get_current_active_user
from schemas.auth import User
from schemas.student_class import (
    ClassCancellationIn,
    DailyClassResponse,
    StudentClassIn,
)

student_class_router = APIRouter()


@student_class_router.get(
    "/daily",
    response_model=DailyClassResponse,
    summary="Get Today's Classes for Current Student",
    description="Fetches the schedule for the currently authenticated student for today, excluding any cancelled classes.",
)
async def get_daily_student_classes(
    current_user: User = Depends(get_current_active_user),
):
    """
    Retrieves the daily class schedule for the authenticated student.

    - This endpoint is intended for users with the "student" role.
    - It automatically filters out any classes that are cancelled for today.
    """
    # This endpoint is for students viewing their own schedule
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access their daily schedule",
        )

    classes_list = await get_daily_classes(current_user)

    today = date.today()

    classes_list_as_dicts = [dict(record) for record in classes_list]

    return DailyClassResponse(date=today, classes=classes_list_as_dicts)


@student_class_router.post("/")
async def create_student_class(
    payload: StudentClassIn,
    current_user: User = Depends(get_current_active_user),
):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to add activities",
        )

    return await create_student_class_crud(payload)


# Process this cancellation request using the details
@student_class_router.post("/cancel")
async def cancel_student_class(
    payload: ClassCancellationIn,
    current_user: User = Depends(get_current_active_user),
):
    """
    Cancels a single class meeting for a specific date.

    Allowed users:
    - "officer" or "admin" can cancel any class.
    - "student" can cancel a class *only if they are the owner*
      of that class.
    """
    try:
        result = await cancel_student_class_crud(payload, current_user)
        return result
    except HTTPException as e:
        # Re-raise HTTP exceptions from the CRUD layer
        raise e
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}",
        )
