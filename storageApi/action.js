/* /action.js */
/**
 * @file
 * @name イベントが発生したら動くアクションをまとめたファイル
 * @memberof action
 */

/* file */
/**
 * getHandlerFileUpdate.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleFileUpdate
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerFileUpdate = ({ paramSnakeToCamel, handleFileUpdate, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath, content } = paramSnakeToCamel(req.body)

    const resultHandleFileUpdate = await handleFileUpdate(clientId, accessToken, owner, filePath, content)
    endResponse(req, res, resultHandleFileUpdate)
  }
}

/**
 * getHandlerFileContent.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleFileContent
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerFileContent = ({ paramSnakeToCamel, handleFileContent, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = paramSnakeToCamel(req.query)

    const resultHandleFileContent = await handleFileContent(clientId, accessToken, owner, filePath)
    endResponse(req, res, resultHandleFileContent)
  }
}

/**
 * getHandlerFileDelete.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleFileDelete
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerFileDelete = ({ paramSnakeToCamel, handleFileDelete, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = paramSnakeToCamel(req.body)

    const resultHandleFileDelete = await handleFileDelete(clientId, accessToken, owner, filePath)
    endResponse(req, res, resultHandleFileDelete)
  }
}

/**
 * getHandlerFileList.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleFileList
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerFileList = ({ paramSnakeToCamel, handleFileList, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = paramSnakeToCamel(req.query)

    const resultHandleFileList = await handleFileList(clientId, accessToken, owner, filePath)
    endResponse(req, res, resultHandleFileList)
  }
}

/* common */
/**
 * getHandlerCheckSignature.
 *
 * @param {} isValidSignature
 * @param {} INVALID_CREDENTIAL
 * @param {} endResponse
 * @return {Promise(Express.next())} 署名が正しかった場合はnext()が呼び出される
 * @memberof action
 */
const getHandlerCheckSignature = ({ isValidSignature, INVALID_CREDENTIAL, endResponse }) => {
  return async (req, res, next) => {
    const clientId = req.headers['x-xlogin-client-id']
    const timestamp = req.headers['x-xlogin-timestamp']
    const path = req.originalUrl
    const requestBody = req.body
    const signature = req.headers['x-xlogin-signature']

    const isValidSignatureResult = await isValidSignature(clientId, timestamp, path, requestBody, signature)
    if (isValidSignatureResult.signatureCheckResult !== true) {
      const status = INVALID_CREDENTIAL
      const error = 'check_signature'
      const resultGetCheckSignature = {
        status, error, response: false, session: null,
      }
      return endResponse(req, res, resultGetCheckSignature)
    }
    return next()
  }
}

export default {
  getHandlerFileUpdate,
  getHandlerFileContent,
  getHandlerFileList,
  getHandlerFileDelete,

  getHandlerCheckSignature,
}

