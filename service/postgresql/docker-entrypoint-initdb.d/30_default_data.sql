\c xl_db

insert into user_info.user_list (email_address, user_name) values ('_@dummy.xlogin.jp', 'dummy');

insert into access_info.client_list (client_id, service_name, redirect_uri, user_serial_id) values
   ('global', '__dummy', '__dummy', 1)
  ,('auth', '__dummy', '__dummy', 1)
  ,('sample_localhost', 'localhost sample', 'http://127.0.0.1:3001/f/xlogin/callback', 1)
  ,('sample_localhost7001', 'localhost sample', 'http://localhost:7001/f/xlogin/callback', 1)
  ,('sample_xlogin_jp', 'xlogin sample service', 'https://sample.xlogin.jp/f/xlogin/callback', 1)
;

insert into access_info.secret_list (client_id, client_secret) values
   ('sample_localhost', '12345678')
  ,('sample_localhost7001', 'abcdefg')
  ,('sample_xlogin_jp', '0101abba')
;

