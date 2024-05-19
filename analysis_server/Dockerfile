FROM python:3.12.1-slim-bullseye

WORKDIR /analysis_server

COPY requirements.txt /analysis_server/

RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    gcc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . /analysis_server/