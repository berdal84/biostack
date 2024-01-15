import datetime
from fastapi.testclient import TestClient
from src.schemas.SamplePost import SamplePost
from src.schemas.SampleGet import SampleGet
from main import app


client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"details": "BioStack says Hello to the World!"}


def test_read_sample_page():
    response = client.get("/sample/")
    assert response.status_code == 200
    json = response.json()
    for each in json:
        assert SampleGet(**each)

def test_read_sample():
    response = client.get("/sample/1/")
    assert response.status_code == 200
    sample = SampleGet(**response.json())
    assert sample.id == 1

def test_create_sample():
    payload = SamplePost(**{
        # "id": "no id",
        "name": "Test",
        "type": "MRI",
        "date": datetime.datetime(2024, 1, 1),
        "path": "/home/me/file.dat"
    })    
    response = client.post( url="/sample", json=payload.model_dump_json() )
    assert response.status_code == 200
    new_sample = SampleGet(**response.json())
    assert new_sample.id is not None;

def test_update_sample():

    id = 42
    payload = SamplePost(**{
        # "id": "not required",
        "name": "Test",
        "type": "MRI",
        "date": datetime.datetime(2024, 1, 1).isoformat(),
        "path": "/home/me/file.dat"
    })
    response = client.put( url="/sample/{}".format(id), json=payload.model_dump_json() )
    assert response.status_code == 200
    new_sample = SampleGet(**response.json())
    assert new_sample.id is id

def test_delete_sample():
    id = 42
    response = client.delete( url="/sample/{}".format(id))
    assert response.status_code == 200
    assert response.json() == { "details": "sample {} deleted".format(id)}