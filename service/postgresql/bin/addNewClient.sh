#! /bin/bash

read -p 'service name (e.g. Sample Client): ' SERVICE_NAME
read -p 'server origin (e.g. sample.example.com): ' _SERVER_ORIGIN

read -p 'CLIENT_ID: ' CLIENT_ID
read -p 'CLIENT_SECRET: ' CLIENT_SECRET

SERVER_ORIGIN=https://${_SERVER_ORIGIN}
CALLBACK_URL=${SERVER_ORIGIN}/f/xlogin/callback
USER_ID=1

docker exec -it xlapp-container-postgresql psql -U xl_admin xl_db -c "insert into access_info.client_list (client_id, service_name, redirect_uri, user_serial_id) values ('${CLIENT_ID}', '${SERVICE_NAME}', '${CALLBACK_URL}', ${USER_ID});"
docker exec -it xlapp-container-postgresql psql -U xl_admin xl_db -c "insert into access_info.secret_list (client_id, client_secret) values ('${CLIENT_ID}', '${CLIENT_SECRET}');"

