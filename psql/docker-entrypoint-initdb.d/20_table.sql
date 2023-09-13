\c xl_db

-- user
create table user_info.user_list (
  user_serial_id serial not null,
  email_address varchar(256),
  user_name varchar(256),
  primary key(user_serial_id)
);
grant all privileges on user_info.user_list to xl_admin;
grant usage on sequence user_info.user_list_user_serial_id_seq to xl_admin;

create table user_info.credential_list (
  email_address varchar(256),
  pass_pbkdf2 varchar(256),
  salt_hex varchar(256)
);
grant all privileges on user_info.credential_list to xl_admin;

create table user_info.personal_data_list (
  email_address varchar(256),
  backup_email_address varchar(256),
  unique(email_address)
);
grant all privileges on user_info.personal_data_list to xl_admin;


create table user_info.service_user_list (
  email_address varchar(256),
  client_id varchar(256),
  service_user_id varchar(256)
);
grant all privileges on user_info.service_user_list to xl_admin;

-- access
create table access_info.client_list (
  client_id varchar(256),
  service_name varchar(128),
  redirect_uri varchar(512),
  user_serial_id int not null references user_info.user_list(user_serial_id)
);
grant all privileges on access_info.client_list to xl_admin;

create table access_info.secret_list (
  client_id varchar(256),
  client_secret varchar(256)
);
grant all privileges on access_info.secret_list to xl_admin;

create table access_info.access_token_list (
  access_token varchar(256),
  client_id varchar(256),
  email_address varchar(256),
  split_permission_list varchar(512)
);
grant all privileges on access_info.access_token_list to xl_admin;

create table access_info.auth_session_list (
  code varchar(256),
  client_id varchar(256),
  condition varchar(256),
  code_challenge_method varchar(256),
  code_challenge varchar(256),
  email_address varchar(256),
  split_permission_list varchar(512)
);
grant all privileges on access_info.auth_session_list to xl_admin;

-- notification
create table notification_info.opened_notification_list (
  email_address varchar(256),
  notification_range varchar(256),
  notification_id varchar(256),
  unique(email_address, notification_range)
);
grant all privileges on notification_info.opened_notification_list to xl_admin;

create table notification_info.notification_list (
  notification_id varchar(256),
  client_id varchar(256),
  email_address varchar(256),
  notification_range varchar(256),
  date_registered varchar(256),
  subject varchar(256),
  detail varchar(256),
  is_opened boolean
);
grant all privileges on notification_info.notification_list to xl_admin;

-- file
create table file_info.file_list (
  file_serial_id serial not null,
  file_label varchar(26) not null,
  client_id varchar(256),
  user_serial_id int not null references user_info.user_list(user_serial_id),
  date_registered varchar(256),
  file_dir varchar(256),
  file_name varchar(256),
  disk_file_path varchar(256)
);
grant all privileges on file_info.file_list to xl_admin;
grant usage on sequence file_info.file_list_file_serial_id_seq to xl_admin;


