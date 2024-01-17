from sqlalchemy import delete, update
from sqlalchemy.orm import Session
from src.database import models
from src import schemas


def get_sample_by_id(db: Session, sample_id: int) -> models.Sample | None:
    return db.query(models.Sample).filter(models.Sample.id == sample_id).first()

def get_sample_page(db: Session, skip: int = 0, limit: int = 100) -> list[models.Sample]:
    return db.query(models.Sample).offset(skip).limit(limit).all()

def create_sample(db: Session, sample: schemas.SampleCreateOrUpdate) -> models.Sample:
    db_sample = models.Sample(**sample.model_dump())
    db.add(db_sample)
    db.commit()
    db.refresh(db_sample)
    return db_sample

def update_sample(db: Session, sample: schemas.SampleCreateOrUpdate) -> models.Sample:
    db_sample = get_sample_by_id(db, sample.id)

    if db_sample is None:
        return None
    
    # Those fields are not optionnal right now, but I plan to change it in the future
    if sample.name is not None:
        db_sample.name = sample.name
    if sample.type is not None:
        db_sample.type = sample.type
    if sample.date is not None:
        db_sample.date = sample.date

    # Only field really optional
    if sample.date is not None:
        db_sample.file_name = sample.file_name

    db.commit()
    return db_sample

def delete_sample(db: Session, sample_id: int) -> bool:
    db_sample = db.get(models.Sample, sample_id)
    if not db_sample:
        return False
    db.delete(db_sample)
    db.commit()
    return True
