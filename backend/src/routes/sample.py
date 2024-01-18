from genericpath import isfile
from mimetypes import guess_type
import os
from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile
from src.schemas.page import Page
from src.utilities.format import formatSampleFileName, getSampleFilePath
from src.database.session import get_session, Session
from src import schemas
from src.database import sample_crud
        
router = APIRouter(
    prefix="/sample",
    tags=["sample"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{sample_id}", description="Read a single sample from a given id")
async def read_sample(sample_id: int, db: Session = Depends(get_session)) -> schemas.Sample:
    db_sample = sample_crud.get_sample_by_id(db, sample_id)
    if db_sample is None:
        raise HTTPException(404)
    return schemas.Sample.model_validate(db_sample, from_attributes=True)

@router.get("/", description="Read a list of N samples with a given offset")
async def read_samples(index: int = 0, limit: int = 100, db: Session = Depends(get_session)) -> Page[schemas.Sample]:
    db_samples = sample_crud.get_sample_page(db, index, limit)

    # TODO: get the count and the list in a single request
    count = sample_crud.get_count(db)
    items = list( map( lambda each: schemas.Sample.model_validate(each, from_attributes=True), db_samples ))
    
    return Page[schemas.Sample](
        items=items,
        total_item_count=count,
        limit=limit,
        index=index
        )


@router.post("/", description="Create a new sample")
async def create_sample(payload: schemas.SampleCreate, db: Session = Depends(get_session)) -> schemas.Sample:
    db_sample = sample_crud.create_sample(db, payload)
    if db_sample is None:
        raise HTTPException(404)
    return schemas.Sample.model_validate(db_sample, from_attributes=True)  
  
@router.put("/{sample_id}", description="Update an existing sample")
async def update_sample(sample_id: int, payload: schemas.SampleUpdate, db: Session = Depends(get_session)) -> schemas.Sample:
    print(payload)
    db_sample = sample_crud.update_sample(db, sample_id, payload)
    if db_sample is None:
        raise HTTPException(404)
    return schemas.Sample.model_validate(db_sample, from_attributes=True)  

@router.delete("/{sample_id}", description="Delete a sample from a existing id")
async def delete_sample(sample_id: int, db: Session = Depends(get_session)):

    # Try to get the sample
    db_sample = sample_crud.get_sample_by_id(db, sample_id)
    if db_sample is None:
        raise HTTPException(404)
    
    # Delete the associated file
    # (Idea: we could move the file instead, to have a backup)
    if db_sample.file_name is not None:
        file_path = getSampleFilePath(db_sample.file_name)
        try:
            os.remove(file_path)
        except Exception: 
            raise HTTPException( 500, f"An error occured when deleting the file {file_path}")

    # Delete the entry in the database
    success = sample_crud.delete_sample(db, sample_id)
    if not success:
        raise HTTPException(422, "Unable to delete the sample")
    
    return { "detail": "Sample {} deleted".format(sample_id) }

@router.post("/{sample_id}/upload", description="Upload a file to associate it to an existing sample.")
async def upload(sample_id: int, file: UploadFile | None, db: Session = Depends(get_session)) -> schemas.Sample:
    
    # Try to get the existing sample first
    db_sample = sample_crud.get_sample_by_id(db, sample_id)
    if not db_sample:
        raise HTTPException(404)

    # Delete any existing file related to this sample
    # TODO: handle when user upload a new file to a sample having already a file attached
    #       Easy solution would be to delete the old file.
    #       Safer would be to ask user to delete explicitly.
    #       Choice may depends if we allow multiple files per sample.
    if db_sample.file_name is not None:
        os.remove(getSampleFilePath(db_sample.file_name))

    # Then, store the uploaded file
    # TODO: create a file dedicated module?
    if not file:
        return HTTPException(422, "No upload file sent")
    file_name = formatSampleFileName(sample_id, file.filename)
    fd = open( getSampleFilePath(file_name), "wb+")
    fd.write(file.file.read())

    # ...And update the path    
    db_sample = sample_crud.update_sample(db, sample_id, file_name=file_name) # store only the filename, path will be retrieved knowing the sample_id anyways.     
    return schemas.Sample.model_validate(db_sample, from_attributes=True)

@router.get("/{sample_id}/download", description="Download the file associated with a given sample")
async def download(sample_id: int, db: Session = Depends(get_session)):

    # Try to get the sample
    db_sample = sample_crud.get_sample_by_id(db, sample_id)
    if db_sample is None:
        return Response(status_code=404)
    
    # Locate the file, read its content and return it
    filename = getSampleFilePath(db_sample.file_name)
    if not isfile(filename):
        return Response(status_code=404)
    with open(filename) as f:
        content = f.read()
    media_type, _ = guess_type(filename)
    return Response(content, media_type=media_type)