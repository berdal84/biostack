
def formatSampleFileName(sample_id: int, filename: str) -> str:
    """ Format a sample file name from a given sample_id and (user's) filename """
    return "sample-{}-{}".format(sample_id, filename)

def getSampleFilePath(sample_filename: str) -> str:
    """ Format a sample file path from an given sample file name"""
    return "./uploads/{}".format(sample_filename) # TODO: add an env var to replace "./uploads/" by getenv("UPLOAD_PATH")