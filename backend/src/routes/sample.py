import os
import shutil
from tempfile import NamedTemporaryFile
from typing import IO
from fastapi import APIRouter, Depends, HTTPException, Header, Response, UploadFile
from fastapi.responses import FileResponse
from src.schemas.page import Page
from src.utilities.format import formatSampleFileName, getSampleFilePath
from src.database.session import get_session, Session
from src import schemas
from src.database import sample_crud
from starlette import status 

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
async def upload(sample_id: int,
                 file: UploadFile,
                 db: Session = Depends(get_session),
                 content_length: int = Header(..., lt=1_000_000)) -> schemas.Sample:
    
    # Try to get the existing sample first
    db_sample = sample_crud.get_sample_by_id(db, sample_id)
    if not db_sample:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    if not file:
        return HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "No upload file sent")
    
    # Delete any existing file related to this sample
    if db_sample.file_name is not None:
        path = getSampleFilePath(db_sample.file_name)
        if os.path.isfile(path):
            os.remove(path)

    # Load the payload chunk by chunk, to avoid loading a too large file
    # Adapted from https://github.com/tiangolo/fastapi/issues/362#issuecomment-584104025
    real_file_size = 0
    temp: IO = NamedTemporaryFile(delete=False)
    for chunk in file.file:
        real_file_size += len(chunk)
        if real_file_size > content_length:
            raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Too large")
        temp.write(chunk)
    temp.close()

    # Move the temp file to a proper location
    file_name = formatSampleFileName(sample_id, file.filename)
    shutil.move(temp.name, getSampleFilePath(file_name))

    # ...And update the path    
    db_sample = sample_crud.update_sample(db, sample_id, file_name=file_name) # store only the filename, path will be retrieved knowing the sample_id anyways.     
    return schemas.Sample.model_validate(db_sample, from_attributes=True)

@router.get("/{sample_id}/download", description="Download the file associated with a given sample")
async def download(sample_id: int, db: Session = Depends(get_session)):

    # Try to get the sample
    db_sample = sample_crud.get_sample_by_id(db, sample_id)
    if db_sample is None:
        return Response(status_code=404)
    
    # Get file path and return a response as octet-stream to avoid the file to be displayed in the browser
    return FileResponse(
        path= getSampleFilePath(db_sample.file_name),
        media_type='application/octet-stream',
        filename=db_sample.file_name)