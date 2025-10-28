# crud/student_class.py
from typing import Dict
import uuid
import asyncpg
from fastapi import HTTPException, status
from schemas.auth import User
from schemas.student_class import ClassCancellationIn, StudentClassIn
from db.base import get_pool


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
