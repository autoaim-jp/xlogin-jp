#! /bin/bash

#docker cp ./secret/backup-postgresql.sql xlapp-container-postgresql:/tmp/backup-postgresql.sql
#docker exec -it xlapp-container-postgresql psql -U xl_admin xl_db -c "SELECT 'TRUNCATE TABLE ' || ARRAY_TO_STRING(ARRAY_AGG(relname), ',') || ';' AS query FROM pg_stat_user_tables WHERE schemaname = 'user_info';"
#docker exec -it xlapp-container-postgresql pg_restore --clean --create -U postgres -d xl_db /tmp/backup-postgresql.sql
#docker exec -it xlapp-container-postgresql rm /tmp/backup-postgresql.sql

cat ./backup/data-postgresql.sql | docker exec -i xlapp-container-postgresql psql -U postgres > /dev/null

