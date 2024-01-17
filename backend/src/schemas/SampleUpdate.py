import datetime
from typing import Optional
from pydantic import BaseModel


class SampleUpdate(BaseModel):

    "Data to update an existing Sample"

    name: Optional[str] = None
    "Name / Label"

    date: Optional[datetime.datetime] = None
    "Date collected"

    type: Optional[str] = None
    "Type of experiment"