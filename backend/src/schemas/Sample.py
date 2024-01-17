import datetime
from typing import Optional
from pydantic import BaseModel

# TODO: search on how to reuse types like we do in TypeScript with Omit, Pick, Readonly, and Partial.
#       This would allow to reuse fields from a base model. Inheritance is not appropriate here.

class Sample(BaseModel):
    "Sample when present in the database"

    id: int
    "Unique identifier"

    name: str
    "Name / Label"

    date: datetime.datetime
    "Date collected"

    type: str
    "Type of experiment"
    
    file_name: Optional[str] = None
    """
    Stored filename (with extension).
    A null value means no file is currently attached to the sample.
    But, we might have a file table in the future to hide the real name and store the user's file name, and extension
    """
