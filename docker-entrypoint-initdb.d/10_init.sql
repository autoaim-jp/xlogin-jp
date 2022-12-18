create database xlogin_jp_db;

revoke all on database xlogin_jp_db from public;

\c xlogin_jp_db

create schema auth_m;

create role xlogin_jp_admin with login password 'xlogin_jp_pass';

grant all privileges on schema auth_m to xlogin_jp_admin;

