
[![Frontend CI](https://github.com/berdal84/biostack/actions/workflows/node.js.yml/badge.svg)](https://github.com/berdal84/biostack/actions/workflows/node.js.yml)

# Biostack

This project is a client/server to manage Biotech Data. It is implemented using FastAPI and NextJS, with a Postgres database.
Code is written in Python and TypeScript.

_Note: this project is an exercise_

## Quick Start

There is two ways to start the apps, the first one rely on docker and docker-compose. The second uses bash scripts to run each service via commands.

### Install and Run
#### Using Docker/Docker-Compose

Prerequisites: docker and docker-compose 3.8+

Run `docker-compose up`

#### Manually

Prerequisites: a GNU/Linux Operating System, postgresql 14+, node 14+, python 3.12

To install and run both front and back end, run the following commands:

```
./install.sh
./run.sh
```

### Launch

Then, browse [127.0.0.1:3000](http://127.0.0.1:3000) to open the app.
Or browse [127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to access backend documentation.

The front and back end are located in [`./frontend`](./frontend) and [`./backend`](./backend) folders respectively.
For more information, read [backend's readme](./backend/README.md) and [frontend's readme](./frontend/README.md).

## Road Map

### General
- [ ] Add more fields on a sample detail (notes, tags, etc.)
- [ ] Permissions: add a user table and credentials on the API
- [ ] Use multipart/form-data to upload a sample (name, type,..., and file! )
- [ ] Allow to upload file using third party services (S3, google drive, etc)

### Frontend
- [x] Implement file upload on the UI
- [x] Highlight items in the light, so user can understand they are clickable.
- [ ] Add small icon-buttons to edit/delete/view a sample (only visible when row is hovered)

### Backend
- [x] Add postres and fastapi to the existing docker-compose.yml
- [ ] Use Github Actions's services to run pytest with postgres
- [ ] Setup Alembic to handle DB upgrades
