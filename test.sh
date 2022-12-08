#! /bin/bash

export COMPOSE_FILE=./docker-compose.test.yml

# docker compose config
# docker compose build
# docker compose up
# docker compose down

docker compose ${1:-config}

