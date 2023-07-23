#! /bin/bash

# using docker, git, yarn

XDEVKIT_VERSION=v0.17

if [ $# != 2 ]; then
  echo "run.sh (app | test) (build | config | up | down)"
  exit 1
fi

fileId=${1:-test}
op=${2:-config}
projectName=xlogin-jp-${fileId}
dockerComposeFile=./docker-compose.${fileId}.yml

if [ $op = "build" ] || [ $op = "xdevkit" ]; then
  # init-xdevkit
  git submodule update -i && pushd src/xdevkit/ && git checkout master && git pull && git checkout $XDEVKIT_VERSION && git pull origin $XDEVKIT_VERSION && yarn install && popd && cp ./src/xdevkit/server/browserServerSetting.js ./src/setting/browserServerSetting.js && cp ./src/xdevkit/server/browserServerSetting.js ./src/view/src/js/_setting/browserServerSetting.js && cp -r ./src/xdevkit/view/src/js/_xdevkit ./src/view/src/js/_lib/
fi

# docker compose config
# docker compose build
# docker compose up
# docker compose down


if [ $fileId = "test" ] && [ $op = "up" ] ; then
  docker compose -p ${projectName} -f ${dockerComposeFile} up > test.log &
  sleep 120
  docker compose -p ${projectName} -f ${dockerComposeFile} down >> test.log &

  cat test.log
  cat test.log | grep "success"
elif [ $fileId = "test" ] && [ $op = "github" ] ; then
  docker compose -p ${projectName} -f ${dockerComposeFile} up | grep "success"
elif [ $op = "clean" ] ; then
  docker compose -p ${projectName} -f ${dockerComposeFile} down
  docker volume rm ${projectName}_xl-rc-redis
  docker volume rm ${projectName}_xl-pc-psql
  docker volume rm ${projectName}_xl-wc-nm
elif [ ! $op = "clean" ] && [ ! $op = "xdevkit" ]; then
  docker compose -p ${projectName} -f ${dockerComposeFile} $op
fi



