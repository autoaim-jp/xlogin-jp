const setting = {}

const init = ({ env }) => {
  setting.env = {}
  setting.env.AMQP_USER = env.AMQP_USER
  setting.env.AMQP_PASS = env.AMQP_PASS
  setting.env.AMQP_HOST = env.AMQP_HOST
  setting.env.AMQP_PORT = env.AMQP_PORT
}

setting.amqp = {}
setting.amqp.TESSERACT_REQUEST_QUEUE = 'tesseract-request-queue'
setting.amqp.TESSERACT_RESPONSE_QUEUE = 'tesseract-response-queue'

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

