import datetime
from pydantic import BaseModel

class Sample(BaseModel):
    "Schema of a Sample at the API level"

    id: str
    "Unique identifier"

    name: str
    "Name / Label"

    date: datetime.datetime
    "Date collected"

    type: str
    "Type of experiment"

    path: str 
    "Path to storage location in server's file system"
