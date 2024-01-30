import datetime
import logging
from fastapi.testclient import TestClient
from src.schemas.page import Page
from src.schemas import SampleCreate, SampleUpdate, Sample
from main import app
from starlette import status


"""
Single test file to run agains the sample API.

In order to gain time, the tests are written not independently.
They will run in the order they are written.
The goal is to keep the DB clean by deleting the test samples.
Of course, it is not ideal, since when a early test fail, it may provoke the next one to fail too.
"""


# Create a named logger
logger = logging.getLogger('biostack')
logger.setLevel(logging.INFO)

client = TestClient(app)

# The sample id this tests will deal with
sample_id: int | None = None

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"details": "BioStack says Hello to the World!"}


def test_create_sample():
    payload = SampleCreate(
        name="Test",
        type="MRI",
        date=datetime.datetime.now()
    )    
    response = client.post( url="/sample", content=payload.model_dump_json() )
    assert response.status_code == 200
    new_sample = Sample.model_validate(response.json())
    global sample_id
    sample_id = new_sample.id
    assert new_sample.id is not None


def test_read_sample_by_page():
    response = client.get("/sample/")
    assert response.status_code == 200   
    assert Page[Sample].model_validate(response.json())


def test_read_sample_by_id():
    global sample_id
    print(sample_id)
    response = client.get("/sample/{}".format(sample_id))
    assert response.status_code == 200
    sample = Sample.model_validate(response.json())
    assert sample.id == sample_id

def test_sample_file_upload():
    global sample_id
    test_file = open("./data/file-for-test.txt", "rb")
    # First upload
    response = client.post(
        url="/sample/{}/upload".format(sample_id),
        files={"file": ("test-file.txt", test_file, "text/plain")} 
        )
    assert response.status_code == status.HTTP_200_OK
    new_sample = Sample.model_validate(response.json())
    assert new_sample.id is sample_id
    assert new_sample.file_name.endswith("test-file.txt")

    # Second upload
    response = client.post(
        url="/sample/{}/upload".format(sample_id),
        files={"file": ("test-file-override.txt", test_file, "text/plain")} 
        )
    assert response.status_code == status.HTTP_200_OK
    new_sample = Sample.model_validate(response.json())
    assert new_sample.file_name.endswith("test-file-override.txt")

def test_sample_file_upload_NO_FILE():
    global sample_id
    # First upload
    response = client.post(
        url="/sample/{}/upload".format(sample_id)
        )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_sample_file_upload_TOO_LARGE():
    global sample_id
    test_file = open("./data/file-for-test-TOO-LARGE.txt", "rb")
    # First upload
    response = client.post(
        url="/sample/{}/upload".format(sample_id),
        files={"file": (test_file.name, test_file, "text/plain")} 
        )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_sample_file_download():
    global sample_id
    response = client.get("/sample/{}/download".format(sample_id))
    assert response.status_code == 200
    original = open("./data/file-for-test.txt", "rb")
    assert original.read() == response.content

def test_update_sample():
    global sample_id
    payload = SampleUpdate(
        name="Test",
        type="MRI",
        date=datetime.datetime.now()
    )
    response = client.put( url="/sample/{}".format(sample_id), content=payload.model_dump_json() )
    assert response.status_code == 200
    new_sample = Sample.model_validate(response.json())
    assert new_sample.id is sample_id


def test_delete_sample():
    global sample_id
    response = client.delete( url="/sample/{}".format(sample_id))
    assert response.status_code == 200
    assert response.json() == { "detail": "Sample {} deleted".format(sample_id)}