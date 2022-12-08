#! /bin/bash

export COMPOSE_FILE=./docker-compose.app.yml

# docker compose config
# docker compose build
# docker compose up
# docker compose down

docker compose ${1:-config}

