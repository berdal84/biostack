# Schema's module main purpose is to distinguish schemas and models:
# import src.schemas
# import src.models
# s = schemas.Sample(...)
# m = models.Sample(...)

from .sample import Sample, SampleCreate, SampleUpdate
from .page import Page