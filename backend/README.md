[![Backend CI](https://github.com/berdal84/biostack/actions/workflows/python.yml/badge.svg)](https://github.com/berdal84/biostack/actions/workflows/python.yml)


# BioStack's Backend

## Install it

Prerequisites:
- Python 3.12 (*1)
- PostgreSQL 14 and above (*1)

From this folder, run the following command:

```
pip install -r requirements.txt
```

Create an `.env` file with the following variables:
```
DB_NAME=biostack
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_HOST=localhost
```
Be sure you have a database named `biostack` in postgres by doing:

```
psql
>> CREATE DATABASE biostack;
```

(*1) Run `python --version` and `psql --version` in the commande line  to double check.

## Run it

```
uvicorn main:app --reload
```

## Documentation

While server is running, browse one of the two URL to get the documentation:

- `http://127.0.0.1:8000/docs` for Swagger (OpenAPI).
- `http://127.0.0.1:8000/redoc` for ReDoc.

File uploads are stored into the [`./uploads/`](./uploads) folder.


## Develop

In development mode, you might want to install the packages via `pip install -r requirements_dev.txt`. This will install few packages to run tests against the API without having to execute the query manually. More info about the tests in `test_main.py`.

To run the tests, run the server and execute pytest in parallel :

```
uvicorn main:app --reload &
pytest
```
