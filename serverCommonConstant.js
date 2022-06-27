const scc = {}

scc.server = {}
scc.server.PORT = 3000
scc.server.PUBLIC_BUILD_DIR = `${process.env.APP_PATH}view/build`
scc.server.PUBLIC_STATIC_DIR = `${process.env.APP_PATH}view/static`

scc.oidc = {}
scc.oidc.XLOGIN_ISSUER = 'https://xlogin.jp'
scc.oidc.CODE_L = 64
scc.oidc.ACCESS_TOKEN_L = 64

scc.url = {}
scc.url.ERROR_PAGE = '/error'
scc.url.AFTER_CONNECT = '/login'
scc.url.AFTER_CHECK_CREDENTIAL = '/confirm'

scc.condition = {}
scc.condition.LOGIN = 'login'
scc.condition.CONFIRM = 'confirm'
scc.condition.CODE = 'code'
scc.condition.USER_INFO = 'user_info'

scc.session = {}
scc.session.SESSION_ID = 'sid'
scc.session.SESSION_COOKIE_SECURE = false
scc.session.REDIS_PORT = 6379
scc.session.REDIS_HOST = '127.0.0.1'
scc.session.REDIS_DB = 1

module.exports = scc

