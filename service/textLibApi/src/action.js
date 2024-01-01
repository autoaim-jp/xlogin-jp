const getHandlerParseText = ({ handleParseText }) => {
  return async (req, res) => {
    const { message } = req.body
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']

    console.log({
      debug: true, message, accessToken, clientId,
    })

    const handleResult = await handleParseText({ message, accessToken, clientId })

    res.json({ result: handleResult })
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
  getHandlerParseText,
  getHandlerCheckSignature,
}

