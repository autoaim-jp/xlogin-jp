/* /common/backend-server/core.js */

const mod = {}

/**
 * init.
 *
 * @param {} setting
 * @param {} input
 * @param {} lib
 * @return {undefined} 戻り値なし
 * @memberof core
 */
const init = ({ setting, input, lib }) => {
  mod.setting = setting
  mod.input = input
  mod.lib = lib
}

/**
 * <pre>
 * getErrorResponse.
 * エラーを返したいときに呼び出す。
 * パラメータを渡すと、エラーレスポンスを作成する。
 * </pre>
 *
 * @return {HandleResult} エラー処理された結果
 * @memberof core
 */
const getErrorResponse = ({ status, error, isServerRedirect, response, session }) => {
  if (isServerRedirect === undefined) {
    isServerRedirect = false
  }
  if (response === undefined) {
    response = null
  }

  if (session === undefined) {
    session = {}
  }

  const redirect = `${mod.setting.getValue('url.ERROR_PAGE')}?error=${encodeURIComponent(error)}`
  if (isServerRedirect) {
    return {
      status, session, response, redirect, error,
    }
  }
  if (response) {
    return {
      status, session, response, error,
    }
  }
  return {
    status, session, response: { status, error, redirect }, error,
  }
}

/**
 * isValidSignature.
 *
 * @param {} clientId
 * @param {} timestamp
 * @param {} path
 * @param {} requestBody
 * @param {} signature
 * @return {signatureCheckResult} クライアントの署名が正しいかどうか
 * @memberof core
 */
const isValidSignature = async ({ clientId, timestamp, path, requestBody, signature }) => {
  const contentHash = mod.lib.backendServerLib.calcSha256AsB64({ str: JSON.stringify(requestBody) })
  const dataToSign = `${timestamp}:${path}:${contentHash}`
  const { execQuery, paramSnakeToCamel, calcSha256HmacAsB64 } = mod.lib.backendServerLib
  const isValidSignatureResult = await mod.input.backendServerInput.isValidSignature({
    clientId, dataToSign, signature, execQuery, paramSnakeToCamel, calcSha256HmacAsB64,
  })
  if (!isValidSignatureResult) {
    return { signatureCheckResult: false }
  }

  return { signatureCheckResult: true }
}


export default {
  init,

  getErrorResponse,

  isValidSignature,
}

