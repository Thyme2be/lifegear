from enum import Enum

# User roles
class UserRole(str, Enum):
    student = "student"
    officer = "officer"
    admin = "admin"

# Activity status
class ActivityStatus(str, Enum):
    running = "running"
    finished = "finished"
    cancelled = "cancelled"

# Activity category
class ActivityCategory(str, Enum):
    academics = "academics"
    recreations = "recreations"
    socials = "socials"
    other = "other"
