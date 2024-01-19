import datetime
from pydantic import BaseModel, Field
from .page import Page
from src.utilities.metaclass import Partial

class SampleBase(BaseModel):
    "Base class for all Sample schemas, for internal use only"
    name: str = Field(default=None, title="Name / Label", max_length=300)
    date: datetime.datetime = Field(default=None, title="Date collected")
    type: str = Field(default=None, title="Type of experiment", max_length=300)


class Sample(SampleBase):
    "Sample existing in the database"
    id: int = Field(title="Unique identifier")
    file_name: str | None = Field(default=None, title="Stored filename (with extension), A null value means no file is currently attached to the sample.")
    """
    Evolution:
        we might have a file table in the future to hide the real name and store the user's file name, and extension
    """

SampleCreate = SampleBase # Simple alias
"Minimal data to create a new Sample"


class SampleUpdate(SampleBase, metaclass=Partial):
    "Data to update an existing Sample"