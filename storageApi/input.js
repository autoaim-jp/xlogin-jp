/* /input.js */
/**
 * @file
 * @name アプリケーションへのデータ入力に関するファイル
 * @memberof input
 */

const mod = {}

/**
 * init.
 *
 * @param {} setting
 * @param {} fs
 * @return {undefined} 戻り値なし
 * @memberof input
 */
const init = (setting, fs) => {
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
const isValidClient = async (clientId, redirectUri, execQuery) => {
  const query = 'select * from access_info.client_list where client_id = $1 and redirect_uri = $2'
  const paramList = [clientId, decodeURIComponent(redirectUri)]

  const { err, result } = await execQuery(query, paramList)
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
const isValidSignature = async (clientId, dataToSign, signature, execQuery, paramSnakeToCamel, calcSha256HmacAsB64) => {
  const query = 'select * from access_info.secret_list where client_id = $1'
  const paramList = [clientId]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  if (err || rowCount === 0) {
    return false
  }

  const { clientSecret } = paramSnakeToCamel(result.rows[0])
  const correctSignature = calcSha256HmacAsB64(clientSecret, dataToSign)

  return signature === correctSignature
}

/* from accessTokenList */
/**
 * _checkPermission.
 *
 * @param {} splitPermissionList
 * @param {} operationKey
 * @param {} range
 * @param {} dataType
 * @return {boolean} 権限があるかどうか
 * @memberof input
 */
const _checkPermission = (splitPermissionList, operationKey, range, dataType) => {
  const { required, optional } = splitPermissionList
  const permissionList = { ...required, ...optional }
  const isAuthorized = Object.entries(permissionList).some(([key, isChecked]) => {
    if (!isChecked) {
      return false
    }
    const keySplit = key.split(':')
    if (keySplit.length !== 3) {
      console.log('[warn] invalid key:', key)
      return false
    }

    if (keySplit[0].indexOf(operationKey) < 0) {
      return false
    }

    if (keySplit[1] !== range) {
      return false
    }

    if (keySplit[2] !== dataType) {
      return false
    }

    return true
  })

  return isAuthorized
}

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
const checkPermissionAndGetEmailAddress = async (accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel) => {
  const query = 'select * from access_info.access_token_list where client_id = $1 and access_token = $2'
  const paramList = [clientId, accessToken]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }
  const { emailAddress, splitPermissionList: splitPermissionListStr } = paramSnakeToCamel(result.rows[0])
  const splitPermissionList = JSON.parse(splitPermissionListStr)
  const isAuthorized = _checkPermission(splitPermissionList, operationKey, range, dataType)
  if (!isAuthorized) {
    return null
  }

  return emailAddress
}

/* from fileList */
/**
 * getFileContent.
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} filePath
 * @return {Array} メールアドレスとファイルパスで取得したファイル
 * @memberof input
 */
const getFileContent = async (emailAddress, clientId, owner, filePath) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.getValue('server.FILE_LIST_JSON')))
  if (!fileList[emailAddress] || !fileList[emailAddress][owner] || !fileList[emailAddress][owner][filePath]) {
    return null
  }

  return fileList[emailAddress][owner][filePath].content
}

/**
 * getFileList.
 * getJsonMessageListとして使えるかも
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} filePath
 * @return {Array} メールアドレスとファイルパスで取得したファイル内容
 * @memberof input
 */
const _getFileList = async (emailAddress, clientId, owner, filePath) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.getValue('server.FILE_LIST_JSON')))
  if (!fileList[emailAddress] || !fileList[emailAddress][owner] || !fileList[emailAddress][owner]) {
    return null
  }

  const resultFileList = Object.keys(fileList[emailAddress][owner]).map((_filePath) => {
    if (_filePath.indexOf(filePath) === 0) {
      const fileObj = { ...fileList[emailAddress][owner][_filePath] }
      delete fileObj.content
      return fileObj
    }
    return null
  }).filter((row) => { return row })


  return resultFileList
}

const getFileList = async (owner, fileDir, execQuery, paramSnakeToCamel) => {
  const query = 'select * from file_info.file_list where client_id = $1 and file_dir = $2'
  const paramList = [owner, fileDir]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  console.log({ err, result })
  if (err || rowCount === 0) {
    return null
  }

  const fileList = []
  result.rows.forEach((row) => {
    const { fileLabel, fileDir, fileName, } = paramSnakeToCamel(row)
    const fileInfo = { fileLabel, fileDir, fileName }
    fileList.push(fileInfo)
  })

  return fileList
}


/* from userList */
/**
 * getUserSerialIdByEmailAddress.
 *
 * @param {} emailAddress
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {User} メールアドレスでDBから取得したユーザ
 * @memberof input
 */
const getUserSerialIdByEmailAddress = async (emailAddress, execQuery, paramSnakeToCamel) => {
  const query = 'select * from user_info.user_list where email_address = $1'
  const paramList = [emailAddress]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  console.log({ err, result })
  if (err || rowCount === 0) {
    return null
  }

  const { userSerialId } = paramSnakeToCamel(result.rows[0])
  const user = { userSerialId }
  return user
}


export default {
  init,
  isValidClient,
  isValidSignature,

  checkPermissionAndGetEmailAddress,

  getFileContent,
  getFileList,

  getUserSerialIdByEmailAddress,
}

