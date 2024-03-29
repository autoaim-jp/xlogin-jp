import backendServerCore from './backendServerCore.js'

const mod = {}
const responseList = {}

const init = async ({
  setting, input, lib, amqpConnection,
}) => {
  const amqpChannel = await amqpConnection.createChannel()
  mod.amqpChannel = amqpChannel

  mod.setting = setting
  mod.lib = lib
  mod.input = input

  backendServerCore.init({ setting, input, lib })
}

/**
 * createPgPool.
 *
 * @param {} pg
 * @return {pg.Pool} DBの接続プール
 * @memberof core
 */
const createPgPool = ({ pg }) => {
  const dbCredential = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    max: 5,
    idleTimeoutMillis: 5 * 1000,
    connectionTimeoutMillis: 5 * 1000,
  }

  return new pg.Pool(dbCredential)
}

const handleParseText = async ({ clientId, accessToken, message }) => {
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'w'
  const range = clientId
  const dataType = 'text_lib_v1'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_text_lib_prompt_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const queue = mod.setting.getValue('amqp.MECAB_PROMPT_QUEUE')
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const requestObj = {
    requestId,
    message,
  }
  const requestObjStr = JSON.stringify(requestObj)

  mod.amqpChannel.sendToQueue(queue, Buffer.from(requestObjStr))

  responseList[requestId] = { emailAddress }

  /* eslint no-async-promise-executor: 0 */
  const parseResult = await new Promise(async (resolve) => {
    for (;;) {
      /* eslint no-await-in-loop: 0 */
      await mod.lib.awaitSleep({ ms: 1 * 1000 })
      const responseObj = responseList[requestId]
      if (responseObj && responseObj.response && responseObj.response.response && responseObj.emailAddress === emailAddress) {
        resolve(responseObj.response.response)
      }
    }
  })

  const status = mod.setting.browserServerSetting.getValue('statusList.SUCCESS')
  const handleResult = { status, result: parseResult }
  return handleResult
}

const startConsumer = async () => {
  const queue = mod.setting.getValue('amqp.MECAB_RESPONSE_QUEUE')
  await mod.amqpChannel.assertQueue(queue)

  mod.amqpChannel.consume(queue, (msg) => {
    if (msg !== null) {
      mod.amqpChannel.ack(msg)
      const responseJson = JSON.parse(msg.content.toString())
      if (!responseList[responseJson.requestId]) {
        // warn no object defined
      } else {
        responseList[responseJson.requestId].response = responseJson
      }
    } else {
      // Consumer cancelled by server
      throw new Error()
    }
  })
}

export default {
  backendServerCore,
  init,
  createPgPool,
  handleParseText,
  startConsumer,
}

