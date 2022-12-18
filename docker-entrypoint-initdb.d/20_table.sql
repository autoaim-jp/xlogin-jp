\c xlogin_jp_db

create table  auth_m.sample (
  col1 varchar(10),
  col2 varchar(10),
  col3 varchar(10),
  primary key (col1)
);

grant all privileges on auth_m.sample to xlogin_jp_admin;

insert into auth_m.sample values('1111', '2221', '3331');
insert into auth_m.sample values('1112', '2222', '3332');
insert into auth_m.sample values('1113', '2223', '3333');

