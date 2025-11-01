import datetime
from typing import List
import uuid
import asyncpg
from fastapi import HTTPException, status
from schemas.auth import User
from schemas.student_class import ClassCancellationIn, StudentClassIn
from db.base import get_pool


async def get_daily_classes(
    current_user: User, today
) -> List[asyncpg.Record]:
    """
    Fetches today's classes for the currently authenticated student,
    excluding any cancelled classes.
    """
    pool = get_pool()
    if not pool:
        raise HTTPException(status_code=500, detail="DB pool not initialized")

    # Get today's date and weekday
    today = today

    # Get the weekday as a number.
    # Assumes Python's convention: 0=Monday, 1=Tuesday, ..., 6=Sunday
    today_weekday = today.weekday()

    # Get the student's ID from the authenticated user
    student_id = current_user.id

    # This raw SQL query performs the complex join and filtering:
    # 1. Joins student_classes (sc) with class_meetings (cm).
    # 2. Filters by the provided student_id and today's weekday.
    # 3. Filters to ensure the class is currently active (today is between start/end dates).
    # 4. LEFT JOINs class_cancellations (cc) *only* for today's date.
    # 5. The key logic: `WHERE cc.id IS NULL` excludes any class that
    #    successfully found a cancellation entry.

    sql_query = """
        SELECT
            sc.class_code,
            sc.class_name,
            cm.start_time,
            cm.end_time
        FROM
            student_classes AS sc
        JOIN
            class_meetings AS cm ON sc.id = cm.student_class_id
        LEFT JOIN
            class_cancellations AS cc 
                ON cm.id = cc.class_meeting_id 
                AND cc.cancellation_date = $1  -- today's date
        WHERE
            sc.student_id = $2              -- this student
            AND cm.weekday = $3               -- today's weekday
            AND $1 BETWEEN sc.class_start_date AND sc.class_end_date -- class is active
            AND cc.id IS NULL               -- AND is NOT cancelled
        ORDER BY
            cm.start_time;
    """

    async with pool.acquire() as conn:
        try:
            class_records = await conn.fetch(
                sql_query,
                today,
                student_id,
                today_weekday,
            )
            return class_records

        except Exception as e:
            print(f"Error fetching daily classes: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching daily classes.",
            )


async def get_monthly_classes(
    current_user: User, date_in_month: datetime.date
) -> List[asyncpg.Record]:
    """
    Fetches all class instances (including their specific dates) for the
    currently authenticated student for the month of the provided date_in_month,
    excluding any cancelled classes.
    """
    
    pool = get_pool()
    if not pool:
        raise HTTPException(status_code=500, detail="DB pool not initialized")

    start_of_month = date_in_month.replace(day=1)
    
    if date_in_month.month == 12:
        next_month_start = date_in_month.replace(year=date_in_month.year + 1, month=1, day=1)
    else:
        next_month_start = date_in_month.replace(month=date_in_month.month + 1, day=1)
        
    end_of_month = next_month_start - datetime.timedelta(days=1)
    
    student_id = current_user.id

    sql_query = """
        SELECT
            dates.class_date,
            sc.class_code,
            sc.class_name,
            cm.start_time,
            cm.end_time
        FROM
            generate_series($1::date, $2::date, '1 day'::interval) AS dates(class_date)
        JOIN
            class_meetings AS cm
                ON MOD(EXTRACT(DOW FROM dates.class_date) + 6, 7) = cm.weekday
        JOIN
            student_classes AS sc ON cm.student_class_id = sc.id
        LEFT JOIN
            class_cancellations AS cc
                ON cm.id = cc.class_meeting_id
                AND dates.class_date = cc.cancellation_date
        WHERE
            sc.student_id = $3
            AND dates.class_date BETWEEN sc.class_start_date AND sc.class_end_date
            AND cc.id IS NULL
        ORDER BY
            dates.class_date, cm.start_time;
    """

    async with pool.acquire() as conn:
        try:
            class_records = await conn.fetch(
                sql_query,
                start_of_month,
                end_of_month, # Passed as the inclusive end date for generate_series
                student_id,
            )
            return class_records

        except Exception as e:
            print(f"Error fetching monthly classes: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching monthly classes.",
            )


async def create_student_class_crud(payload: StudentClassIn):

    pool = get_pool()

    if not pool:
        raise HTTPException(status_code=500, detail="DB pool not initialized")

    class_id = uuid.uuid4()
    async with pool.acquire() as conn:
        async with conn.transaction():
            # Insert main class record
            await conn.execute(
                """
                INSERT INTO student_classes (
                  id, student_id, class_code, class_name,
                  class_start_date, class_end_date, location, section, notes
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                """,
                str(class_id),
                payload.student_id,
                payload.class_code,
                payload.class_name,
                payload.class_start_date,
                payload.class_end_date,
                payload.location,
                payload.section,
                payload.notes,
            )

            # Insert meetings
            meetings_values = [
                (
                    str(uuid.uuid4()),
                    str(class_id),
                    m.weekday,
                    m.start_time,
                    m.end_time,
                    m.repeat_rule,
                )
                for m in payload.meetings
            ]

            for mv in meetings_values:
                await conn.execute(
                    """
                    INSERT INTO class_meetings
                      (id, student_class_id, weekday, start_time, end_time, repeat_rule)
                    VALUES ($1,$2,$3,$4,$5,$6)
                    """,
                    mv[0],
                    mv[1],
                    mv[2],
                    mv[3],
                    mv[4],
                    mv[5],
                )

    return {"id": str(class_id), "message": "created"}


async def cancel_student_class_crud(payload: ClassCancellationIn, current_user: User):
    pool = get_pool()
    if not pool:
        raise HTTPException(status_code=500, detail="DB pool not initialized")

    async with pool.acquire() as conn:
        async with conn.transaction():

            # 1. Get the owner_id of the class to authorize
            owner_record = await conn.fetchrow(
                """
                SELECT sc.student_id
                FROM student_classes sc
                JOIN class_meetings cm ON sc.id = cm.student_class_id
                WHERE cm.id = $1
                """,
                payload.class_meeting_id,
            )

            if not owner_record:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Class meeting not found",
                )

            owner_id = owner_record["student_id"]

            # 2. Perform Authorization Check
            is_officer = current_user.role in ["officer", "admin"]
            is_student_owner = (
                current_user.role == "student" and current_user.id == owner_id
            )

            if not (is_officer or is_student_owner):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to cancel this class",
                )

            # 3. Insert the cancellation record
            try:
                cancellation_id = uuid.uuid4()
                await conn.execute(
                    """
                    INSERT INTO class_cancellations 
                        (id, class_meeting_id, cancellation_date, created_by, reason)
                    VALUES ($1, $2, $3, $4, $5)
                    """,
                    cancellation_id,
                    payload.class_meeting_id,
                    payload.cancellation_date,
                    current_user.id,
                    payload.reason,
                )
                return {
                    "id": cancellation_id,
                    "message": "Class cancelled for the specified date",
                }

            except asyncpg.exceptions.UniqueViolationError:
                # This catches the unique constraint on (class_meeting_id, cancellation_date)
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="This class meeting is already cancelled for this date",
                )

            except asyncpg.exceptions.ForeignKeyViolationError:
                # This could happen if the class_meeting_id is invalid
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Class meeting ID not found",
                )
