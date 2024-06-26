import browserServerSetting from './browserServerSetting.js'

const setting = {}

const init = ({ env }) => {
  setting.env = {}
  setting.env.SERVER_ORIGIN = env.SERVER_ORIGIN
  setting.env.SESSION_SECRET = env.SESSION_SECRET
  setting.env.SERVER_PORT = env.SERVER_PORT
  setting.env.SERVICE_NAME = env.SERVICE_NAME

  setting.env.AMQP_USER = env.AMQP_USER
  setting.env.AMQP_PASS = env.AMQP_PASS
  setting.env.AMQP_HOST = env.AMQP_HOST
  setting.env.AMQP_PORT = env.AMQP_PORT
}

setting.amqp = {}
setting.amqp.TESSERACT_REQUEST_QUEUE = 'tesseract-request-queue'
setting.amqp.TESSERACT_RESPONSE_QUEUE = 'tesseract-response-queue'

setting.url = {}
setting.url.API_VERSION = 'v0.1.0'
setting.url.ERROR_PAGE = '/error'
setting.url.AFTER_CONNECT = '/login'
setting.url.AFTER_CHECK_CREDENTIAL = '/confirm'

setting.key = {}
setting.key.FORM_UPLOAD = 'file'

setting.server = {}
setting.server.FORM_UPLOAD_DIR = 'data/upload/'

setting.api = {}
setting.api.deprecated = {
  // '/api/v0.1.0/file/update': { deprecated: { start: '2023/08/28', end: '2023/09/31', message: 'move to /text API with same interface without path' } },
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
  browserServerSetting,
  init,
  getList,
  getValue,
}

