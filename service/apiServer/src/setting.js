const setting = {}

const init = ({ env }) => {
  setting.env = {}
  setting.env.SERVER_PORT = env.SERVER_PORT

  setting.env.AMQP_USER = env.AMQP_USER
  setting.env.AMQP_PASS = env.AMQP_PASS
  setting.env.AMQP_HOST = env.AMQP_HOST
  setting.env.AMQP_PORT = env.AMQP_PORT
}

setting.static = {}
setting.static.PUBLIC_STATIC_DIR = 'view/static'

setting.amqp = {}
setting.amqp.CHATGPT_PROMPT_QUEUE = 'chatgpt-prompt-queue'
setting.amqp.CHATGPT_RESPONSE_QUEUE = 'chatgpt-response-queue'

setting.api = {}
const API_ROOT_PATH = '/api/v1'
setting.api.REGISTER_PROMPT = `${API_ROOT_PATH}/prompt/register`
setting.api.LOOKUP_CHATGPT_RESPONSE = `${API_ROOT_PATH}/response/lookup`

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

