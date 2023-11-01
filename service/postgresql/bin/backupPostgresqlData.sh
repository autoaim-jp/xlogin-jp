#! /bin/bash

# docker exec -it xlapp-container-postgresql pg_dump -Fc -U postgres -d xl_db > ./secret/backup-postgresql.sql
# docker exec -it xlapp-container-postgresql pg_dumpall -c --if-exists -U postgres > ./secret/backup-postgresql.sql

mkdir -p ./backup/
docker exec xlapp-container-postgresql  pg_dumpall -U postgres -c > ./backup/data-postgresql.sql

