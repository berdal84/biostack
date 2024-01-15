
# BioStack's Backend

## Install it

Prerequisites:
- Python 3.12*
- PostgreSQL 14 and above*

From this folder, run the following command:

```
pip install -r requirements.txt
```

* Run `python --version` and `psql --version` in the commande line  to double check.

## Run it

```
uvicorn main:app --reload
```

## Understand it

While server is running, browse one of the two URL to get the documentation:

- `http://127.0.0.1:8000/docs` for Swagger (OpenAPI).
- `http://127.0.0.1:8000/redoc` for ReDoc.