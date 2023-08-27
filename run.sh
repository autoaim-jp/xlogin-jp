#! /bin/bash

# using docker, git, yarn

if [ ! $# = 0 ] && [ $1 = "help" ]; then
  echo "./run.sh (app | test) (build | config | up | down)"
  echo "example:"
  echo "  ./run.sh app up #start server"
  echo "  ./run.sh app down #stop server"
  echo "  ./run.sh app build #recreate image"
  echo "  ./run.sh app xdevkit #update xdevkit"
  exit 1
fi
echo "./run.sh help #show help"

set -euxo pipefail

XDEVKIT_VERSION=v0.17

fileId=${1:-app}
op=${2:-up}
projectName=xlogin-jp-${fileId}
dockerComposeFile=./docker/docker-compose.${fileId}.yml

echo "===== ./run.sh ${fileId} ${op} ====="


if [ $op = "build" ] || [ $op = "xdevkit" ]; then
  # init-xdevkit
  git submodule update -i && pushd src/xdevkit/ && git checkout master && git pull && git checkout $XDEVKIT_VERSION && git pull origin $XDEVKIT_VERSION && yarn install && popd && cp ./src/xdevkit/server/browserServerSetting.js ./src/setting/browserServerSetting.js && cp ./src/xdevkit/server/browserServerSetting.js ./src/view/src/js/_setting/browserServerSetting.js && cp -r ./src/xdevkit/view/src/js/_xdevkit ./src/view/src/js/_lib/
fi

# docker compose config
# docker compose build
# docker compose up
# docker compose down

if [ $fileId = "test" ] && [ $op = "up" ] ; then
  docker compose -p ${projectName} -f ${dockerComposeFile} up --abort-on-container-exit
elif [ $op = "clean" ] ; then
  docker compose -p ${projectName} -f ${dockerComposeFile} down --volumes
elif [ ! $op = "clean" ] && [ ! $op = "xdevkit" ]; then
  docker compose -p ${projectName} -f ${dockerComposeFile} $op
fi



