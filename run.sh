#! /bin/bash

XDEVKIT_VERSION=v0.12

if [ $# != 2 ]; then
  echo "run.sh (app | test) (build | config | up | down)"
  exit 1
fi

fileId=${1:-test}
op=${2:-config}


if [ $op = "build" ]; then
  # init-xdevkit
  git submodule update -i && pushd src/xdevkit/ && git checkout master && git pull && git checkout $XDEVKIT_VERSION && git pull origin $XDEVKIT_VERSION && popd && cp ./src/xdevkit/browserServerSetting.js ./src/setting/browserServerSetting.js && cp ./src/xdevkit/browserServerSetting.js ./src/view/src/js/_setting/browserServerSetting.js
fi

export COMPOSE_FILE=./docker-compose.${fileId}.yml

# docker compose config
# docker compose build
# docker compose up
# docker compose down

docker compose $op

