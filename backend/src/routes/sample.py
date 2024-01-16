from fastapi import APIRouter, Depends, HTTPException
from backend.src.database.session import get_db, Session
from src import schemas
from src.database import sample_crud
        
router = APIRouter(
    prefix="/sample",
    tags=["sample"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{sample_id}", description="Read a single sample from a given id")
async def read_sample(sample_id: int, db: Session = Depends(get_db)) -> schemas.Sample:
    db_sample = sample_crud.get_sample_by_id(db, sample_id)
    if db_sample is None:
        raise HTTPException(404)
    return schemas.Sample.model_validate(db_sample, from_attributes=True)

@router.get("/", description="Read a list of N samples with a given offset")
async def read_samples(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> list[schemas.Sample]:
    db_samples = sample_crud.get_sample_page(db, skip, limit)
    return list(map(lambda each: schemas.Sample.model_validate(each, from_attributes=True), db_samples))

@router.post("/", description="Create a new sample")
async def create_sample(payload: schemas.SampleCreateOrUpdate, db: Session = Depends(get_db)) -> schemas.Sample:
    db_sample = sample_crud.create_sample(db, payload)
    if db_sample is None:
        raise HTTPException(404)
    response = schemas.Sample.model_validate(db_sample, from_attributes=True)
    print(response)
    return response

@router.delete("/{sample_id}", description="Delete a sample from a existing id")
async def delete_sample(sample_id: int, db: Session = Depends(get_db)):
    success = sample_crud.delete_sample(db, sample_id)
    if not success:
        raise HTTPException(404)
    return { "detail": "Sample {} deleted".format(sample_id) }