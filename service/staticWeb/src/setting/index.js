/* /setting/index.js */
const setting = {}

const init = (env) => {
  setting.env = {}
  setting.env.SERVER_ORIGIN = env.SERVER_ORIGIN
  setting.env.TLS_KEY_PATH = env.TLS_KEY_PATH
  setting.env.TLS_CERT_PATH = env.TLS_CERT_PATH
  setting.env.SERVER_PORT = env.SERVER_PORT

  setting.env.METRICS_SERVER_PORT = env.METRICS_SERVER_PORT
  setting.env.METRICS_SERVER_ORIGIN = env.METRICS_SERVER_ORIGIN
}

setting.static = {}
setting.static.PUBLIC_BUILD_DIR = 'view/build'
setting.static.PUBLIC_STATIC_DIR = 'view/static'

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
}

