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
    music = "music"
    sports_and_exercise = "sports_and_exercise"
    arts_and_culture = "arts_and_culture"
    academics_and_technology = "academics_and_technology"
    social_and_volunteering = "social_and_volunteering"
    professional_and_vocational_skills = "professional_and_vocational_skills"
    recreation_and_entertainment = "recreation_and_entertainment"
    mind_and_ethics = "mind_and_ethics"
