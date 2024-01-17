import datetime
from fastapi.testclient import TestClient
from src.schemas import SampleCreateOrUpdate, Sample
from main import app


client = TestClient(app)

# The sample id this tests will deal with
sample_id: int | None = None

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"details": "BioStack says Hello to the World!"}


def test_create_sample():
    payload = SampleCreateOrUpdate(
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
    json = response.json()
    for each in json:
        assert Sample.model_validate(each)


def test_read_sample_by_id():
    global sample_id
    print(sample_id)
    response = client.get("/sample/{}".format(sample_id))
    assert response.status_code == 200
    sample = Sample.model_validate(response.json())
    assert sample.id == sample_id

def test_sample_file_upload():
    global sample_id
    response = client.post(
        url="/sample/{}/upload".format(sample_id),
        files={"file": ("file-for-test.txt", open("./data/file-for-test.txt", "rb"), "text/plain")} 
        )
    assert response.status_code == 200
    new_sample = Sample.model_validate(response.json())
    assert new_sample.id is sample_id

def test_update_sample():
    global sample_id
    payload = SampleCreateOrUpdate(
        name="Test",
        type="MRI",
        date=datetime.datetime.now()
    )
    response = client.put( url="/sample/{}".format(sample_id), json=payload.model_dump_json() )
    assert response.status_code == 200
    new_sample = Sample.model_validate(response.json())
    assert new_sample.id is sample_id


def test_delete_sample():
    global sample_id
    response = client.delete( url="/sample/{}".format(sample_id))
    assert response.status_code == 200
    assert response.json() == { "detail": "Sample {} deleted".format(sample_id)}