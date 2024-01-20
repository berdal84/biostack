# Dockerfile

# pull the official docker image
FROM python:3.12.1

# set work directory
RUN mkdir /app
WORKDIR /app

# set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .

# Run server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]