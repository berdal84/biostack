
[![Frontend CI](https://github.com/berdal84/biostack/actions/workflows/node.js.yml/badge.svg)](https://github.com/berdal84/biostack/actions/workflows/node.js.yml)

# Biostack

This project is a client/server to manage Biotech Data. It is implemented using FastAPI and NextJS, with a Postgres database.
Code is written in Python and TypeScript.

_Note: this project is an exercise_

## Quick Start

Prerequisites: a GNU/Linux Operating System, postgresql 14+, node 14+, python 3.12

To install and run both front and back end, run the following commands:

```
./install.sh
./run.sh
```

Then, browse [localhost:3000](http://localhost:3000) to open the app.
Or browse [localhost:8000/docs](http://localhost:8000/docs) to access backend documentation.

The front and back end are located in [`./frontend`](./frontend) and [`./backend`](./backend) folders respectively.
For more information, read [backend's readme](./backend/README.md) and [frontend's readme](./frontend/README.md) go know more about it.

## Road Map

### General
- Permissions: add a user table and credentials on the API
- Use multipart/form-data to upload a sample (name, type,..., and file! )

### Frontend
- Implement file upload on the UI
- Highlight items in the light, so user can understand they are clickable.
- Add small icon-buttons to edit/delete/view a sample (only visible when row is hovered)

### Backend
- Add postres and fastapi to the existing docker-compose.yml
- User Github actions to run pytest with postgres (service)
