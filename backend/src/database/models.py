from sqlalchemy import Column, Integer, String, Date
from .database import Base


class Sample(Base):
    __tablename__ = "samples"

    id   = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String)
    date = Column(Date)
    path = Column(String)