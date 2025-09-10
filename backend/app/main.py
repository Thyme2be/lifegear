from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.routes import router

app = FastAPI()

origins = [
    "http://localhost:3000", "https://lifegear.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/v1/api/auth", tags=["auth"])


@app.get("/")
def read_root():
    return {"Hello": "World"}
