/* /setting/index.js */
import browserServerSetting from './browserServerSetting.js'

const setting = {}

const init = (env) => {
  setting.env = {}
  setting.env.SERVER_ORIGIN = env.SERVER_ORIGIN
  setting.env.SESSION_SECRET = env.SESSION_SECRET
  setting.env.SERVER_PORT = env.SERVER_PORT
  setting.env.SERVICE_NAME = env.SERVICE_NAME
}

setting.startup = {}
setting.startup.MAX_RETRY_PSQL_CONNECT_N = 30
setting.server = {}
setting.server.AUTH_SERVER_CLIENT_ID = 'auth'
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
setting.session.REDIS_HOST = 'redis_container'
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

setting.api = {}
setting.api.deprecated = {
  '/api/v0.1.0/file/update': { deprecated: { start: '2023/08/28', end: '2023/09/31', message: 'move to /text API with same interface without path' } },
  '/api/v0.1.0/file/content': { deprecated: { start: '2023/08/28', end: '2023/09/31', message: 'move to /text API with same interface without path' } },
  '/api/v0.1.0/file/delete': { deprecated: { start: '2023/08/28', end: '2023/09/31', message: 'move to /text API with same interface without path' } },
  '/api/v0.1.0/file/list': { deprecated: { start: '2023/08/28', end: '2023/09/31', message: 'move to /text API with same interface without path' } },
}

const getList = (...keyList) => {
  /* eslint-disable no-param-reassign */
  const constantList = keyList.reduce((prev, key) => {
    let value = setting
    for (const keySplit of key.split('.')) {
      value = value[keySplit]
    }
    prev[key.slice(key.lastIndexOf('.') + 1)] = value
    return prev
  }, {})
  for (const key of keyList) {
    if (constantList[key.slice(key.lastIndexOf('.') + 1)] === undefined) {
      throw new Error(`[error] undefined setting constant: ${key}`)
    }
  }
  return constantList
}


const getValue = (key) => {
  let value = setting
  for (const keySplit of key.split('.')) {
    value = value[keySplit]
  }
  return value
}

export default {
  init,
  getList,
  getValue,
  browserServerSetting,
}

