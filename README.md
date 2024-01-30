
[![Frontend CI](https://github.com/berdal84/biostack/actions/workflows/node.js.yml/badge.svg)](https://github.com/berdal84/biostack/actions/workflows/node.js.yml)
[![Backend CI](https://github.com/berdal84/biostack/actions/workflows/python.yml/badge.svg)](https://github.com/berdal84/biostack/actions/workflows/python.yml)

# Biostack

<img src="https://github.com/berdal84/biostack/blob/main/frontend/public/biostack-logo.svg" height="128" />

This project is a client/server to manage Biotech Data. It is implemented using FastAPI and NextJS, with a Postgres database.
Code is written in Python and TypeScript.

_Note: this project is an exercise_

## Quick Start

To install and start the app, we rely on a bash script and docker compose.

### Install

Prerequisites:
- docker and docker-compose must be installed

Run `./biostask.sh install` an follow the instructions.


### Start

Run `./biostask.sh start` an follow the instructions.


## Road Map

### General
- [ ] Add more fields on a sample detail (notes, tags, etc.)
- [ ] Permissions: add a user table and credentials on the API
- [ ] Use multipart/form-data to upload a sample (name, type,..., and file! )
- [ ] Allow to upload file using third party services (S3, google drive, etc)
- [x] Deploy on a VPS
- [ ] Allow http only (for dev purposes) in addition to https

### Frontend
- [x] Implement file upload on the UI
- [x] Highlight items in the light, so user can understand they are clickable.
- [ ] Add small icon-buttons to edit/delete/view a sample (only visible when row is hovered)

### Backend
- [x] Add postres and fastapi to the existing docker-compose.yml
- [x] Use Github Actions's services to run pytest with postgres
- [ ] Setup Alembic to handle DB upgrades
