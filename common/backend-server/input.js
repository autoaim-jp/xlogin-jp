/* /common/server/input.js */
const mod = {}

/**
 * init.
 *
 * @param {} setting
 * @param {} fs
 * @return {undefined} 戻り値なし
 * @memberof input
 */
const init = ({ setting, fs }) => {
  mod.setting = setting

  mod.fs = fs
}

/* from clientList */
/**
 * isValidClient.
 *
 * @param {} clientId
 * @param {} redirectUri
 * @param {} execQuery
 * @return {boolean} クライアントが正しいかどうかDBを確認した結果
 * @memberof input
 */
const isValidClient = async ({ clientId, redirectUri, execQuery }) => {
  const query = 'select * from access_info.client_list where client_id = $1 and redirect_uri = $2'
  const paramList = [clientId, decodeURIComponent(redirectUri)]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0) {
    return false
  }

  return true
}

/**
 * isValidSignature.
 *
 * @param {} clientId
 * @param {} dataToSign
 * @param {} signature
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @param {} calcSha256HmacAsB64
 * @return {boolean} クライアントの署名が正しいかどうかDBを確認した結果
 * @memberof input
 */
const isValidSignature = async ({ clientId, dataToSign, signature, execQuery, paramSnakeToCamel, calcSha256HmacAsB64 }) => {
  const query = 'select * from access_info.secret_list where client_id = $1'
  const paramList = [clientId]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0) {
    return false
  }

  const { clientSecret } = paramSnakeToCamel({ paramList: result.rows[0] })
  const correctSignature = calcSha256HmacAsB64({ secret: clientSecret, str: dataToSign })

  return signature === correctSignature
}

/* from accessTokenList */
/**
 * checkPermissionAndGetEmailAddress.
 *
 * @param {} accessToken
 * @param {} clientId
 * @param {} operationKey
 * @param {} range
 * @param {} dataType
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {String} アクセストークンでDBから取得したメールアドレス
 * @memberof input
 */
const checkPermissionAndGetEmailAddress = async ({ accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission }) => {
  const query = 'select * from access_info.access_token_list where client_id = $1 and access_token = $2'
  const paramList = [clientId, accessToken]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }
  const { emailAddress, splitPermissionList: splitPermissionListStr } = paramSnakeToCamel({ paramList: result.rows[0] })
  const splitPermissionList = JSON.parse(splitPermissionListStr)
  const isAuthorized = checkPermission({ splitPermissionList, operationKey, range, dataType })
  if (!isAuthorized) {
    return null
  }

  return emailAddress
}



export default {
  init,

  isValidClient,
  isValidSignature,
  
  checkPermissionAndGetEmailAddress,
}

