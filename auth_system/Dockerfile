FROM python:3.12.1-slim-bullseye

WORKDIR /auth_system

COPY requirements.txt /auth_system/

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . /auth_system/