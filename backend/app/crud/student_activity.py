from datetime import date, datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta
from typing import List
from fastapi import HTTPException, status
from schemas.student_activity import StudentActivityResponse
from db.base import supabase
from uuid import UUID, uuid4


def get_daily_activity(
    user_id: UUID, target_date: date
) -> List[StudentActivityResponse]:

    day_start = datetime.combine(target_date, datetime.min.time(), tzinfo=timezone.utc)

    next_day_start = day_start + timedelta(days=1)

    response = (
        supabase.table("student_activities")
        .select("activities(title, start_at, end_at)")
        .eq("student_id", str(user_id))
        .lt("activities.start_at", next_day_start.isoformat())
        .gt("activities.end_at", day_start.isoformat())
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


def get_monthly_activities_crud(
    user_id: UUID, target_date: date
) -> List[StudentActivityResponse]:

    if target_date is None:
        today_start = datetime.now(timezone.utc).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        month_start = today_start.replace(day=1)
    else:
        month_start = datetime.combine(
            target_date.replace(day=1),
            datetime.min.time(),
            tzinfo=timezone.utc,
        )
        
    next_month_start = month_start + relativedelta(months=1)

    response = (
        supabase.table("student_activities")
        .select("activities(title, start_at, end_at)")
        .eq("student_id", str(user_id))
        .lt("activities.start_at", next_month_start.isoformat())
        .gt("activities.end_at", month_start.isoformat())
        .order("start_at", desc=False, foreign_table="activities")
        .execute()
    )

    if not response.data:
        return []

    activities_list = []
    for item in response.data:
        activity_data = item.get("activities")
        if activity_data:
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
