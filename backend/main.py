from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src import routes
from src.database import models
from src.database.database import engine

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost",
    "https://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # allow_credentials=True,  TODO: user accounts
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.sample)

@app.get("/")
def home() -> dict[str, str]:
    return {
        "details": "BioStack says Hello to the World!"
    }