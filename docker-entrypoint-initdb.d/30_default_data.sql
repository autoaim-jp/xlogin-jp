\c xl_db

insert into access_info.client_list (client_id, service_name, redirect_uri) values
   ('global', '__dummy', '__dummy')
  ,('auth', '__dummy', '__dummy')
  ,('sample_localhost', 'localhost sample', 'http://127.0.0.1:3001/f/xlogin/callback')
  ,('sample_localhost7001', 'localhost sample', 'http://localhost:7001/f/xlogin/callback')
  ,('sample_xlogin_jp', 'xlogin sample service', 'https://sample.xlogin.jp/f/xlogin/callback')
;

insert into access_info.secret_list (client_id, client_secret) values
   ('sample_localhost', '12345678')
  ,('sample_localhost7001', 'abcdefg')
  ,('sample_xlogin_jp', '0101abba')
;

