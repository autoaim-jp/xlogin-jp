#! /bin/bash

./run.sh app down
docker volume rm xlogin-jp_xl-rc-redis
docker volume rm xlogin-jp_xl-pc-psql
docker volume rm xlogin-jp_xl-wc-nm

