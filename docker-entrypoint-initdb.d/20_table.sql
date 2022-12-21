\c xl_db

create table user_info.user_list (
  col1 varchar(10),
  col2 varchar(10)
);
grant all privileges on user_info.user_list to xl_admin;

create table user_info.notification_list (
  col1 varchar(10),
  col2 varchar(10)
);
grant all privileges on user_info.notification_list to xl_admin;


create table access_info.client_list (
  client_id varchar(128),
  service_name varchar(128),
  redirect_uri varchar(512)
);
grant all privileges on access_info.client_list to xl_admin;

create table access_info.access_token_list (
  col1 varchar(10),
  col2 varchar(10)
);
grant all privileges on access_info.access_token_list to xl_admin;

create table access_info.auth_session_list (
  code varchar(256),
  client_id varchar(256),
  condition varchar(256),
  code_challenge_method varchar(256),
  code_challenge varchar(256),
  email_address varchar(256),
  split_permission_list varchar(256)
);
grant all privileges on access_info.auth_session_list to xl_admin;

