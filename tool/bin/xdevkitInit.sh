#! /bin/bash

set -e
read -p "project dir name: " projectDirName
git clone git@github.com:/autoaim-jp/xlogin-jp-client-sample.git ${projectDirName}

cd $projectDirName
yarn install

git submodule update -i

sessionSecret=`cat /dev/urandom | base64 | fold -w 32 | head -n 1`

read -p "server port: " serverPort
read -p "clientId: " clientId
read -p "server origin: [https://${clientId}.xlogin.jp]" serverOrigin
serverOrigin=${serverOrigin:-https://${clientId}.xlogin.jp}
read -p "tls key path [/var/www/node/dummy-cert/server.key]: " tlsKeyPath
tlsKeyPath=${tlsKeyPath:-/var/www/node/dummy-cert/server.key}
read -p "tls cert path [/var/www/node/dummy-cert/server.crt]: " tlsCertPath
tlsCertPath=${tlsCertPath:-/var/www/node/dummy-cert/server.crt}
read -p "auth server origin[https://xlogin.jp]: " authServerOrigin
authServerOrigin=${authServerOrigin:-https://xlogin.jp}

cat <<EOF > .env
SESSION_SECRET='${sessionSecret}'

SERVER_PORT=${serverPort}
CLIENT_ID='${clientId}'
SERVER_ORIGIN='${serverOrigin}'
TLS_KEY_PATH='${tlsKeyPath}'
TLS_CERT_PATH='${tlsCertPath}'
AUTH_SERVER_ORIGIN='${authServerOrigin}'
EOF

echo 'done.'

