from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.routes import auth_router, activity_router

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "https://lifegear.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/v1/api/auth", tags=["auth"])
app.include_router(activity_router, prefix="/v1/api/activities", tags=["activities"])


@app.get("/")
def read_root():
    return {"Hello": "World"}
