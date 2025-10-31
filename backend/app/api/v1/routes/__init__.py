from .auth import auth_router
from .activity import activity_router
from .student_class import student_class_router
from .student_activity import student_activity_router
from .calendar import calendar_router

__all__ = [
    "auth_router",
    "activity_router",
    "student_class_router",
    "student_activity_router",
    "calendar_router",
]
