from fastapi import APIRouter, Depends, status, HTTPException
from schemas.student_activity import StudentActivityCreate
from crud.student_activity import (
    create_student_activity,
)

from core.security import get_current_active_user
from schemas.auth import User


student_activity_router = APIRouter()


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
