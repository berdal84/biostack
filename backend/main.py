from fastapi import FastAPI
from src import routes
from src.database import models
from src.database.database import engine

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(routes.sample)

@app.get("/")
def home() -> dict[str, str]:
    return {
        "details": "BioStack says Hello to the World!"
    }