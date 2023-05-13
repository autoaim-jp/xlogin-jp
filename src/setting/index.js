/* /setting/index.js */
import browserServerSetting from './browserServerSetting.js'

export const setting = {}

export const init = (env) => {
  setting.env = {}
  setting.env.SERVER_ORIGIN = env.SERVER_ORIGIN
  setting.env.SESSION_SECRET = env.SESSION_SECRET
  setting.env.TLS_KEY_PATH = env.TLS_KEY_PATH
  setting.env.TLS_CERT_PATH = env.TLS_CERT_PATH
  setting.env.SERVER_PORT = env.SERVER_PORT
}

setting.startup = {}
setting.startup.MAX_RETRY_PSQL_CONNECT_N = 5
setting.server = {}
setting.server.AUTH_SERVER_CLIENT_ID = 'auth'
setting.server.PUBLIC_BUILD_DIR = 'view/build'
setting.server.PUBLIC_STATIC_DIR = 'view/static'
setting.server.PRIVATE_FILE_DIR = 'data/file'
setting.server.FILE_LIST_JSON = 'data/fileList.json'

setting.oidc = {}
setting.oidc.CODE_L = 64
setting.oidc.ACCESS_TOKEN_L = 64

setting.url = {}
setting.url.API_VERSION = 'v0.1.0'
setting.url.ERROR_PAGE = '/error'
setting.url.AFTER_CONNECT = '/login'
setting.url.AFTER_CHECK_CREDENTIAL = '/confirm'

setting.condition = {}
setting.condition.LOGIN = 'login'
setting.condition.CONFIRM = 'confirm'
setting.condition.CODE = 'code'
setting.condition.USER_INFO = 'user_info'

setting.session = {}
setting.session.SESSION_ID = 'sid'
setting.session.SESSION_COOKIE_SECURE = false
setting.session.REDIS_PORT = 6379
setting.session.REDIS_HOST = 'rediscontainer'
setting.session.REDIS_DB = 1

setting.user = {}
setting.user.SERVICE_USER_ID_L = 64
setting.user.HMAC_SECRET = 'xlogin20220630'
setting.user.DEFAULT_USER_NAME = 'no name'

setting.notification = {}
/**
 * 全ての通知を取得する際に使うキーワード。
 * xlogin内で表示するときに使う。
 * 新サービスのクライアントIDには使用できない。
 * @param setting.notification.ALL_NOTIFICATION
 * @memberof parameter
 */
setting.notification.ALL_NOTIFICATION = 'global'

/**
 * xdevkitからコピーしたbrowserServerSettingをここから呼び出す。
 * @param setting.browserServerSetting
 * @memberof parameter
 */
setting.browserServerSetting = browserServerSetting

