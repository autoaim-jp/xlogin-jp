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

const handleRegisterPrompt = async ({ clientId, accessToken, prompt }) => {
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'w'
  const range = clientId
  const dataType = 'chatgpt'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_chatgpt_prompt_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const queue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE')
  await mod.amqpChannel.assertQueue(queue)

  const requestId = mod.lib.getUlid()
  const requestObj = {
    requestId,
    prompt,
  }
  const requestObjStr = JSON.stringify(requestObj)

  mod.amqpChannel.sendToQueue(queue, Buffer.from(requestObjStr))

  responseList[requestId] = { emailAddress }

  const handleResult = { isRegistered: true, requestId }
  return handleResult
}

const handleLookupChatgptResponse = async ({ clientId, accessToken, requestIdList }) => {
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'r'
  const range = clientId
  const dataType = 'chatgpt'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_chatgpt_response_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const handleResult = {}

  requestIdList.forEach((requestId) => {
    const responseObj = responseList[requestId]
    if (responseObj && responseObj.response && responseObj.response.response && responseObj.emailAddress === emailAddress) {
      handleResult[requestId] = { waiting: false, result: responseObj.response.response }
    } else {
      handleResult[requestId] = { waiting: true }
    }
  })

  return handleResult
}

const startConsumer = async () => {
  const queue = mod.setting.getValue('amqp.CHATGPT_RESPONSE_QUEUE')
  await mod.amqpChannel.assertQueue(queue)

  mod.amqpChannel.consume(queue, (msg) => {
    if (msg !== null) {
      mod.amqpChannel.ack(msg)
      const responseJson = JSON.parse(msg.content.toString())
      if (!responseList[responseJson.requestId]) {
        return
      }
      responseList[responseJson.requestId].response = responseJson
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
  handleRegisterPrompt,
  handleLookupChatgptResponse,
  startConsumer,
}

