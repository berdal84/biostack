import datetime
from fastapi import APIRouter
from ..schemas import Sample

router = APIRouter(
    prefix="/sample",
    tags=["sample"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def read_samples() -> list[Sample]:
    return  [{
            "id": "123456789",
            "name": "Sample Name",
            "date": datetime.datetime(2021, 1, 1),
            "type": "Ultrasounds",
            "path": "file:///samples/file.dat"
        }]
