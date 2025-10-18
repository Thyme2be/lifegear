from typing import Final

import re
import uuid

MAX_SLUG_LENGTH: Final[int] = 128


def sanitize_name(name: str) -> str:
    """Lowercase, replace spaces with -, remove special chars."""
    
    name = name.lower().strip()
    name = re.sub(r"\s+", "-", name)  # spaces -> hyphen
    name = re.sub(r"[^a-z0-9\-]", "", name)  # remove other chars

    # remove multiple hyphens
    name = re.sub(r"-{2,}", "-", name).strip("-")
    return name[:MAX_SLUG_LENGTH]


def unique_activity_folder(name: str) -> str:
    name_cleaned = sanitize_name(name)
    unique_suffix = uuid.uuid4()
    return f"{name_cleaned}_{unique_suffix}"


def unique_file_name(name: str) -> str:
    name_cleaned = sanitize_name(name)
    unique_suffix = uuid.uuid4()
    ext = name.split(".")[-1].lower()
    return f"{name_cleaned}_{unique_suffix}.{ext}"
