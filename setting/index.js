/* /setting/index.js */
import browserServerSetting from './browserServerSetting.js'

const setting = {}

setting.server = {}
setting.server.PUBLIC_BUILD_DIR = 'view/build'
setting.server.PUBLIC_STATIC_DIR = 'view/static'
setting.server.CLIENT_LIST_JSON = 'data/clientList.json'
setting.server.USER_LIST_JSON = 'data/userList.json'

setting.oidc = {}
setting.oidc.CODE_L = 64
setting.oidc.ACCESS_TOKEN_L = 64

setting.url = {}
setting.url.API_VERSION = 'v0.7'
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
setting.session.REDIS_HOST = '127.0.0.1'
setting.session.REDIS_DB = 1

setting.user = {}
setting.user.SERVICE_USER_ID_L = 64
setting.user.HMAC_SECRET = 'xlogin20220630'

setting.bsc = browserServerSetting

export default setting

