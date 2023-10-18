#! /bin/bash

SERVICE_NAME='xlogin sample client 2'
SERVER_ORIGIN='https://sample.tnet.work'
CALLBACK_URL="${SERVER_ORIGIN}/f/xlogin/callback"
USER_ID=1

function setRandom() {
  RND=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w $1 | head -1)
}

setRandom 32
CLIENT_ID=$RND 
setRandom 32
CLIENT_SECRET=$RND 
setRandom 32
SESSION_SECRET=$RND

docker exec -it xlapp-container-postgresql psql -U xl_admin xl_db -c "insert into access_info.client_list (client_id, service_name, redirect_uri, user_serial_id) values ('${CLIENT_ID}', '${SERVICE_NAME}', '${CALLBACK_URL}', ${USER_ID});"
docker exec -it xlapp-container-postgresql psql -U xl_admin xl_db -c "insert into access_info.secret_list (client_id, client_secret) values ('${CLIENT_ID}', '${CLIENT_SECRET}');"

echo "CLIENT_ID: $CLIENT_ID"
echo "CLIENT_SECRET: $CLIENT_SECRET"


echo -e "==================================================\n\n"

cat <<EOL
tee service/webServer/src/.env <<EOF > /dev/null
SERVER_PORT=3001
SERVER_ORIGIN=${SERVER_ORIGIN}
TLS_KEY_PATH='cert/server.key'
TLS_CERT_PATH='cert/server.crt'

SESSION_SECRET='${SESSION_SECRET}'
CLIENT_ID='${CLIENT_ID}'
CLIENT_SECRET='${CLIENT_SECRET}'

API_SERVER_ORIGIN='https://xlogin.jp'
AUTH_SERVER_ORIGIN='https://xlogin.jp'
EOF
EOL

echo -e "\n\n=================================================="

