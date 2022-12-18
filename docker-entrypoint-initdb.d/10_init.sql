create database xl_db;

revoke all on database xl_db from public;

\c xl_db

create role xl_admin with login password 'xl_pass';
grant connect on database xl_db to xl_admin;

create schema user_info;
grant all privileges on schema user_info to xl_admin;

create schema access_info;
grant all privileges on schema access_info to xl_admin;



