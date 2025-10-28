from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.routes import auth_router, activity_router, student_class_router
from db.base import init_db, close_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await init_db()
    try:
        yield
    finally:
        # shutdown
        await close_db()


app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:3000", "https://lifegear.vercel.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(activity_router, prefix="/api/v1/activities", tags=["activities"])
app.include_router(
    student_class_router, prefix="/api/v1/student-classes", tags=["student_classes"]
)


@app.get("/")
def read_root():
    return {"Hello": "World"}
