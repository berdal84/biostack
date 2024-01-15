from .SamplePost import SamplePost

class SampleGet(SamplePost):
    "Schema of a Sample at the API level"

    id: str
    "Unique identifier"

