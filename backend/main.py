from fastapi import FastAPI
from src import routes

app = FastAPI()

app.include_router(routes.sample)

@app.get("/")
def home() -> dict[str, str]:
    return {
        "details": "BioStack says Hello to the World!"
    }