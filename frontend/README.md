
[![Frontend CI](https://github.com/berdal84/biostack/actions/workflows/node.js.yml/badge.svg)](https://github.com/berdal84/biostack/actions/workflows/node.js.yml)

# BioStack's Frontend

Frontend to dialog with BioStack's API.

## Install

Install the dependencies:

```bash
npm install
```

## Run

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Deployment

### Using Docker

Prerequisites:
- docker 3.8+ & docker-compose installed

Run the following command to build and deploy localy

```
docker compose -f "docker-compose.prod.yml" up -d --build
```

### Manual

Define a `.env.production` file to declare `BIOSTACK_API_HOST` this way:

```
BIOSTACK_API_HOST=<your-public-url>
```

By default, this var will fallback to `http://localhost`


WIP

