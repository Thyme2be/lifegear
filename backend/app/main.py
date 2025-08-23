from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import authenticate_router

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authenticate_router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
