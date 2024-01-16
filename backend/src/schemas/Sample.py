from .SampleCreateOrUpdate import SampleCreateOrUpdate

class Sample(SampleCreateOrUpdate):
    "Schema of a Sample at the API level"

    id: int
    "Unique identifier"

