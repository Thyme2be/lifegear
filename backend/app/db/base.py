import asyncio
import os
import asyncpg
from supabase import create_client, Client
from dotenv import load_dotenv

# Load .env file
load_dotenv()

supabase_url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_KEY")
database_url: str = os.environ.get("DATABASE_URL")

supabase: Client = create_client(supabase_url, supabase_key)

pool: asyncpg.pool.Pool | None = None


def get_pool():
    return pool


async def init_db():

    global pool
    if pool:
        return

    if not database_url:
        raise RuntimeError("SUPABASE_DB_URL environment variable is not set")

    pool = await asyncpg.create_pool(
        database_url, min_size=1, max_size=10, statement_cache_size=0
    )


async def close_db():
    """Closes the database connection pool gracefully with a timeout."""
    global pool
    if pool:
        print("Attempting to close database pool...")
        try:
            await asyncio.wait_for(pool.close(), timeout=10.0)
            print("Database pool closed successfully.")
        except asyncio.TimeoutError:
            print(
                "Database pool close timed out (10s). "
                "This indicates a connection leak (a connection was acquired but not released)."
            )
        finally:
            pool = None
