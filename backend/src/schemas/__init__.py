# Schema's module main purpose is to distinguish schemas and models:
# import src.schemas
# import src.models
# s = schemas.Sample(...)
# m = models.Sample(...)

from .Sample import Sample, SampleCreate, SampleUpdate