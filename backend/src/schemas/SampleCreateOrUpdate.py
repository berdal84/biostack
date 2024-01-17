import datetime
from typing import Optional
from pydantic import BaseModel


class SampleCreateOrUpdate(BaseModel):
    "Schema of a Sample at the API level"

    name: str
    "Name / Label"

    date: datetime.datetime
    "Date collected"

    type: str
    "Type of experiment"

    file_name: Optional[str] = None
    """
    Temporarily store the real file name (stored, without extension).
    But, we might have a file table in the future to hide the real name and store the user's file name, and extension
    """
