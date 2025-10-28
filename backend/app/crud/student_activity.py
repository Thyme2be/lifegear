from datetime import date, datetime, timezone, timedelta
from typing import List
from fastapi import HTTPException, status
from schemas.auth import User
from schemas.student_activity import StudentActivityResponse
from db.base import supabase
from uuid import UUID, uuid4


def get_daily_activity(user_id: UUID) -> List[StudentActivityResponse]:

    today_start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )

    tomorrow_start = today_start + timedelta(days=1)

    response = (
        supabase.table("student_activities")
        .select("activities(title, start_at, end_at)")
        .eq("student_id", str(user_id))
        .lt("activities.start_at", tomorrow_start.isoformat())
        .gt("activities.end_at", today_start.isoformat())
        .order("start_at", desc=False, foreign_table="activities")
        .execute()
    )

    if not response.data:
        return []

    activities_list = []
    for item in response.data:
        activity_data = item.get("activities")
        if activity_data:
            # Validate and create the response object
            activities_list.append(StudentActivityResponse(**activity_data))
    return activities_list


def create_student_activity(student_id: UUID, activity_id: UUID):
    activity_check = (
        supabase.table("activities")
        .select("id")
        .eq("id", str(activity_id))
        .limit(1)
        .execute()
    )

    if not activity_check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found"
        )

    existing_check = (
        supabase.table("student_activities")
        .select("id")
        .eq("student_id", str(student_id))
        .eq("activity_id", str(activity_id))
        .limit(1)
        .execute()
    )

    if existing_check.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already added this activity",
        )

    new_id = str(uuid4())
    data_to_insert = {
        "id": new_id,
        "student_id": str(student_id),
        "activity_id": str(activity_id),
        "added_at": datetime.now(timezone.utc).isoformat(),
    }

    response = supabase.table("student_activities").insert(data_to_insert).execute()

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add activity",
        )

    return new_id
