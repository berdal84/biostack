import datetime
from pydantic import BaseModel

class SampleCreate(BaseModel):

    "Minimal data to create a new Sample"

    name: str
    "Name / Label"

    date: datetime.datetime
    "Date collected"

    type: str
    "Type of experiment"
