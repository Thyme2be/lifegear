from fastapi import APIRouter, Depends, HTTPException, Query, status
from crud.student_class import cancel_student_class_crud, create_student_class_crud
from core.security import get_current_active_user
from schemas.auth import User
from schemas.student_class import ClassCancellationIn, StudentClassIn

student_class_router = APIRouter()


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
