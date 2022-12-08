#! /bin/bash

XDEVKIT_VERSION=master

if [ $# != 1 ]; then
  echo "build | config | up | down"
  exit 1
fi

if [ ${1} = "build" ]; then
  # init-xdevkit
  git submodule update -i && pushd src/xdevkit/ && git checkout master && git pull && git checkout $XDEVKIT_VERSION && git pull origin $XDEVKIT_VERSION && popd && cp ./src/xdevkit/browserServerSetting.js ./src/setting/browserServerSetting.js && cp ./src/xdevkit/browserServerSetting.js ./src/view/src/js/_setting/browserServerSetting.js
fi

export COMPOSE_FILE=./docker-compose.app.yml

# docker compose config
# docker compose build
# docker compose up
# docker compose down

docker compose ${1:-config}

