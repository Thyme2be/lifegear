from enum import Enum

# User roles
class UserRole(str, Enum):
    student = "student"
    officer = "officer"
    admin = "admin"

# Activity status
class ActivityStatus(str, Enum):
    upcoming = "upcoming"
    running = "running"
    finished = "finished"
    cancelled = "cancelled"

# Activity category
class ActivityCategory(str, Enum):
    academics = "academics"
    recreations = "recreations"
    socials = "socials"
    other = "others"
    
class ContactType(str, Enum):
    EMAIL = "email"
    PHONE = "phone"
    WEBSITE = "website"
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    YOUTUBE = "youtube"
    TIKTOK = "tiktok"
    OTHER = "other"
