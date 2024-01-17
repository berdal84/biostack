import datetime
from pydantic import BaseModel
from .page import Page
from src.utilities.metaclass import Partial

class SampleBase(BaseModel):
    "Base class for all Sample schemas, for internal use only"

    name: str
    "Name / Label"

    date: datetime.datetime
    "Date collected"

    type: str
    "Type of experiment"


class Sample(SampleBase):
    "Sample existing in the database"

    id: int
    "Unique identifier"
    
    file_name: str | None
    """
    Stored filename (with extension).

    A null value means no file is currently attached to the sample.
    Evolution:
        we might have a file table in the future to hide the real name and store the user's file name, and extension
    """


SampleCreate = SampleBase # Simple alias
"Minimal data to create a new Sample"


class SampleUpdate(SampleBase, metaclass=Partial):
    "Data to update an existing Sample"