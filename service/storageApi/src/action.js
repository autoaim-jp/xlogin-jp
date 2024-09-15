/* /action.js */
/**
 * @file
 * @name イベントが発生したら動くアクションをまとめたファイル
 * @memberof action
 */

/* json */
/**
 * getHandlerJsonUpdate.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleJsonUpdate
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerJsonUpdate = ({ paramSnakeToCamel, handleJsonUpdate, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, jsonPath, content } = paramSnakeToCamel({ paramList: req.body })

    const resultHandleJsonUpdate = await handleJsonUpdate({
      clientId, accessToken, owner, jsonPath, content,
    })
    endResponse({ req, res, handleResult: resultHandleJsonUpdate })
  }
}

/**
 * getHandlerJsonContent.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleJsonContent
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerJsonContent = ({ paramSnakeToCamel, handleJsonContent, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, jsonPath } = paramSnakeToCamel({ paramList: req.query })

    const resultHandleJsonContent = await handleJsonContent({
      clientId, accessToken, owner, jsonPath,
    })
    endResponse({ req, res, handleResult: resultHandleJsonContent })
  }
}

/**
 * getHandlerJsonList.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleJsonContent
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerJsonList = ({ paramSnakeToCamel, handleJsonList, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, jsonPath } = paramSnakeToCamel({ paramList: req.query })

    const resultHandleJsonList = await handleJsonList({
      clientId, accessToken, owner, jsonPath,
    })
    endResponse({ req, res, handleResult: resultHandleJsonList })
  }
}


/**
 * getHandlerJsonDelete.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleJsonDelete
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerJsonDelete = ({ paramSnakeToCamel, handleJsonDelete, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, jsonPath } = paramSnakeToCamel({ paramList: req.body })

    const resultHandleJsonDelete = await handleJsonDelete({
      clientId, accessToken, owner, jsonPath,
    })
    endResponse({ req, res, handleResult: resultHandleJsonDelete })
  }
}

/* file */

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
    const { owner, fileDir } = paramSnakeToCamel({ paramList: req.query })

    const resultHandleFileList = await handleFileList({
      clientId, accessToken, owner, fileDir,
    })
    endResponse({ req, res, handleResult: resultHandleFileList })
  }
}

/**
 * getHandlerFileContent.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleFileContent
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerFileContent = ({ paramSnakeToCamel, handleFileContent }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, fileDir, fileLabel } = paramSnakeToCamel({ paramList: req.query })

    const resultHandleFileContent = await handleFileContent({
      clientId, accessToken, owner, fileDir, fileLabel,
    })
    res.end(resultHandleFileContent)
  }
}

/**
 * getHandlerFileCreate.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleFileCreate
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerFileCreate = ({
  handleFileCreate, endResponse,
}) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']

    const resultHandleFileCreate = await handleFileCreate({
      req, clientId, accessToken,
    })
    endResponse({ req, res, handleResult: resultHandleFileCreate })
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
    let content = null
    const contentTypeHeader = (req?.headers || {})['content-type'] || ''
    if (contentTypeHeader.indexOf('multipart/form-data') === 0) {
      content = { contentType: req.headers['content-type'] }
    } else {
      content = req.body
    }
    const signature = req.headers['x-xlogin-signature']

    // :TODO 引数確認
    const isValidSignatureResult = await isValidSignature({
      clientId, timestamp, path, requestBody: content, signature,
    })
    if (isValidSignatureResult.signatureCheckResult !== true) {
      const status = INVALID_CREDENTIAL
      const error = 'check_signature'
      const resultGetCheckSignature = {
        status, error, response: false, session: null,
      }
      return endResponse({ req, res, handleResult: resultGetCheckSignature })
    }
    return next()
  }
}

export default {
  getHandlerJsonUpdate,
  getHandlerJsonContent,
  getHandlerJsonList,
  getHandlerJsonDelete,

  getHandlerFileList,
  getHandlerFileContent,
  getHandlerFileCreate,

  getHandlerCheckSignature,
}

