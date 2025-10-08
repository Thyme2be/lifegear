from fastapi import HTTPException, UploadFile
from db.base import supabase

from utils.string_utils import unique_activity_folder, unique_file_name

async def upload_activity_image(
    category: str, activity_name: str, image_file: UploadFile, filename: str
) -> str:
    file_byte = await image_file.read()

    activity_clean = unique_activity_folder(activity_name)
    file_name = unique_file_name(filename)
    
    file_path = f"media/activities/{category}/{activity_clean}/{file_name}"

    # Upload file to supabase
    # File limit at 5MB (Handle by Supabase)
    # File Type [jpeg jpg png] (Handle by Supabase)
    result = supabase.storage.from_("media").upload(file_path, file_byte)
    if result.error:
        raise HTTPException(status_code=500, detail=result.error)
