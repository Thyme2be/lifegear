import mimetypes
from fastapi import HTTPException, UploadFile
from db.base import supabase

from utils.string_utils import unique_activity_folder, unique_file_name


def check_activity_exist(id: str) -> bool:
    res = supabase.table("activities").select("id").eq("id", id).execute()
    if res.data:
        return True
    return False


from fastapi import HTTPException


def move_activity_image(activity_id: str, new_category: str) -> dict:
    data = (
        supabase.table("activities")
        .select("image_path")
        .eq("id", activity_id)
        .execute()
    )

    if not data.data:
        return {"error": "Activity not found"}

    image_path_old_url = data.data[0]["image_path"]

    try:
        # The path in the bucket is the part of the URL after `/media/`
        path_in_bucket = image_path_old_url.split("/media/")[1].split("?")[0]

        # Ensure no leading slash
        path_in_bucket = path_in_bucket.lstrip("/")
    except IndexError:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse the image path from the URL: {image_path_old_url}",
        )
    try:
        file_content: bytes = supabase.storage.from_("media").download(path_in_bucket)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to download image from path '{path_in_bucket}': {str(e)}",
        )

    try:
        parts = path_in_bucket.split("/")
        # path: activities/<category>/<activity_folder>/<filename>
        activity_name = parts[-2]
        file_name = parts[-1]
    except IndexError:
        raise HTTPException(
            status_code=500,
            detail=f"Could not determine activity name and file name from path: {path_in_bucket}",
        )

    new_file_path = f"activities/{new_category}/{activity_name}/{file_name}"

    # Image type
    file_options = {
        "content-type": mimetypes.guess_type(file_name)[0],
        "upsert": "true",
    }

    supabase.storage.from_("media").upload(
        path=new_file_path, file=file_content, file_options=file_options
    )

    # Update the database with the new public URL. Supabase client adds the leading slash for get_public_url.
    img_public_url = supabase.storage.from_("media").get_public_url(new_file_path)
    supabase.table("activities").update({"image_path": img_public_url}).eq(
        "id", activity_id
    ).execute()

    # Delete the old file
    supabase.storage.from_("media").remove([path_in_bucket])
    return {
        "message": "Image moved successfully.",
        "bucket": "media",
        "new_path": img_public_url,
    }


async def upload_activity_image(
    category: str, activity_name: str, image_file: UploadFile, filename: str
) -> str:
    file_byte = await image_file.read()
    activity_clean = unique_activity_folder(activity_name)
    file_name = unique_file_name(filename)

    file_path = f"activities/{category}/{activity_clean}/{file_name}"

    # File Type [jpeg jpg png] (Handle by Supabase)
    file_options = {
        "content-type": image_file.content_type,
        "upsert": "true",
    }

    # Upload file to supabase
    # File limit at 5MB (Handle by Supabase)
    supabase.storage.from_("media").upload(
        path=file_path, file=file_byte, file_options=file_options
    )

    img_public_url = supabase.storage.from_("media").get_public_url(file_path)
    return img_public_url


def delete_activity_image(id: str):
    data = supabase.table("activities").select("image_path").eq("id", id).execute()
    image_path = data.data[0]["image_path"]

    if not image_path:
        return

    # The public URL is in the format:
    # .../storage/v1/object/public/media/activities/<category>/<activity_folder>/<filename>
    # We need to extract the folder path: `activities/<category>/<activity_folder>`
    try:
        path_in_bucket = image_path.split("/media/")[1].split("?")[0]
        path_in_bucket = path_in_bucket.lstrip("/")
        # We want the folder, not the file
        folder_path = "/".join(path_in_bucket.split("/")[:-1])
    except (IndexError, AttributeError):
        raise HTTPException(
            status_code=500, detail="Failed to parse image folder path from URL."
        )
    try:
        # List all files in the folder
        files_to_delete = supabase.storage.from_("media").list(folder_path)

        if not files_to_delete:
            return

        # Create a list of file paths to remove
        file_paths = [f"{folder_path}/{file['name']}" for file in files_to_delete]

        # Remove all the files, and Supabase will automatically remove empty folder
        supabase.storage.from_("media").remove(file_paths)

    except Exception as e:
        # print(f"Error deleting activity image folder for activity {id}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete activity image folder: {str(e)}"
        )
