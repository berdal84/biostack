from sqlalchemy import delete, update
from sqlalchemy.orm import Session
from src.database import models
from src import schemas

""" CRUD for the Sample table """

def get_sample_by_id(db: Session, sample_id: int) -> models.Sample | None:
    return db.query(models.Sample).filter(models.Sample.id == sample_id).first()

def get_sample_page(db: Session, skip: int = 0, limit: int = 100) -> list[models.Sample]:
    return db.query(models.Sample).offset(skip).limit(limit).all()

def get_count(db: Session) -> int:
    return db.query(models.Sample).count()

def create_sample(db: Session, sample: schemas.SampleCreate) -> models.Sample:
    db_sample = models.Sample(**sample.model_dump())
    db.add(db_sample)
    db.commit()
    db.refresh(db_sample)
    return db_sample

def update_sample(db: Session, sample_id: int, new_data: schemas.SampleUpdate = None, file_name: str | None = None) -> models.Sample:
    """
    update a sample with new data and an optionnal file_name
    """

    # Try to get the existing sample
    db_sample = get_sample_by_id(db, sample_id)
    if db_sample is None:
        return None    

    # Update the fields when necessary
    if new_data:
        if new_data.name is not None:
            db_sample.name = new_data.name
        if new_data.type is not None:
            db_sample.type = new_data.type
        if new_data.date is not None:
            db_sample.date = new_data.date

    if file_name:
        db_sample.file_name = file_name # This field is not included in SampleUpdate because it has to be set by the system, never directly by a client.

    db.commit()
    return db_sample

def delete_sample(db: Session, sample_id: int) -> bool:
    db_sample = db.get(models.Sample, sample_id)
    if not db_sample:
        return False
    db.delete(db_sample)
    db.commit()
    return True
