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


/* from userList */
/**
 * getUserByEmailAddress.
 *
 * @param {} emailAddress
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {User} メールアドレスでDBから取得したユーザ
 * @memberof input
 */
const getUserByEmailAddress = async (emailAddress, execQuery, paramSnakeToCamel) => {
  const query = 'select * from user_info.user_list where email_address = $1'
  const paramList = [emailAddress]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }

  const { userName } = paramSnakeToCamel(result.rows[0])
  const user = { emailAddress, userName }
  return user
}

/**
 * isValidCredential.
 *
 * @param {} emailAddress
 * @param {} passHmac2
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @param {} calcPbkdf2
 * @return {boolean} ユーザ名とパスワードが正しいかどうか
 * @memberof input
 */
const isValidCredential = async (emailAddress, passHmac2, execQuery, paramSnakeToCamel, calcPbkdf2) => {
  const query = 'select * from user_info.credential_list where email_address = $1'
  const paramList = [emailAddress]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  if (err || rowCount === 0) {
    return false
  }

  const { passPbkdf2: correctPassPbkdf2, saltHex } = paramSnakeToCamel(result.rows[0])

  if (!saltHex) {
    return false
  }

  const passPbkdf2 = await calcPbkdf2(passHmac2, saltHex)
  return passPbkdf2 === correctPassPbkdf2
}

/* from authSessionList */
/**
 * getAuthSessionByCode.
 *
 * @param {} code
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {Session} DBから取得したセッション情報
 * @memberof input
 */
const getAuthSessionByCode = async (code, execQuery, paramSnakeToCamel) => {
  const query = 'select * from access_info.auth_session_list where code = $1'
  const paramList = [code]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }

  const authSession = paramSnakeToCamel(result.rows[0])

  return authSession
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

/* from accessTokenList, userList */
/**
 * getUserByAccessToken.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} filterKeyList
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {User} アクセストークンでDBから取得したユーザ情報
 * @memberof input
 */
const getUserByAccessToken = async (clientId, accessToken, filterKeyList, execQuery, paramSnakeToCamel) => {
  /* clientId, accessToken => emailAddress */
  const queryGetEmailAddress = 'select * from access_info.access_token_list where client_id = $1 and access_token = $2'
  const paramListGetEmailAddress = [clientId, accessToken]

  const { err: errGetEmailAddress, result: resultGetEmailAddress } = await execQuery(queryGetEmailAddress, paramListGetEmailAddress)
  const { rowCount: rowCountGetEmailAddress } = resultGetEmailAddress
  if (errGetEmailAddress || rowCountGetEmailAddress === 0) {
    return null
  }

  const { emailAddress, splitPermissionList: splitPermissionListStr } = paramSnakeToCamel(resultGetEmailAddress.rows[0])
  const splitPermissionList = JSON.parse(splitPermissionListStr)

  /* emailAddress => userInfo */
  const publicData = {}
  for await (const key of filterKeyList) {
    const keySplit = key.split(':')
    if (keySplit.length !== 2) {
      console.log('[warn] invalid key:', key)
      return null
    }
    if (_checkPermission(splitPermissionList, 'r', keySplit[0], keySplit[1])) {
      if (keySplit[0] === mod.setting.getValue('server.AUTH_SERVER_CLIENT_ID') && keySplit[1] === 'userName') {
        const queryGetUserInfo = 'select * from user_info.user_list where email_address = $1'
        const paramListGetUserInfo = [emailAddress]

        const { err: errGetUserInfo, result: resultGetUserInfo } = await execQuery(queryGetUserInfo, paramListGetUserInfo)
        const { rowCount: rowCountGetUserInfo } = resultGetUserInfo
        if (errGetUserInfo || rowCountGetUserInfo === 0) {
          publicData[key] = null
        } else {
          const { userName } = paramSnakeToCamel(resultGetUserInfo.rows[0])
          publicData[key] = userName
        }
      } else if (keySplit[0] === mod.setting.getValue('server.AUTH_SERVER_CLIENT_ID') && keySplit[1] === 'backupEmailAddress') {
        const queryGetUserPersonalInfo = 'select * from user_info.personal_data_list where email_address = $1'
        const paramListGetUserPersonalInfo = [emailAddress]

        const { err: errGetUserPersonalInfo, result: resultGetUserPersonalInfo } = await execQuery(queryGetUserPersonalInfo, paramListGetUserPersonalInfo)
        const { rowCount: rowCountGetUserPersonalInfo } = resultGetUserPersonalInfo
        if (errGetUserPersonalInfo || rowCountGetUserPersonalInfo === 0) {
          publicData[key] = null
        } else {
          const { backupEmailAddress } = paramSnakeToCamel(resultGetUserPersonalInfo.rows[0])
          publicData[key] = backupEmailAddress
        }
      } else if (keySplit[1] === 'serviceUserId') {
        const dataClientId = keySplit[0]
        const queryGetServiceUserInfo = 'select * from user_info.service_user_list where email_address = $1 and client_id = $2'
        const paramListGetServiceUserInfo = [emailAddress, dataClientId]

        const { err: errGetServiceUserInfo, result: resultGetServiceUserInfo } = await execQuery(queryGetServiceUserInfo, paramListGetServiceUserInfo)
        const { rowCount: rowCountGetServiceUserInfo } = resultGetServiceUserInfo
        if (errGetServiceUserInfo || rowCountGetServiceUserInfo === 0) {
          publicData[key] = null
        } else {
          const { serviceUserId } = paramSnakeToCamel(resultGetServiceUserInfo.rows[0])
          publicData[key] = serviceUserId
        }
      } else {
        publicData[key] = null
      }
    }
  }

  return { public: publicData }
}

/**
 * getCheckedRequiredPermissionList.
 *
 * @param {} clientId
 * @param {} emailAddress
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {Array} 必須の権限をDBから取得した結果
 * @memberof input
 */
const getCheckedRequiredPermissionList = async (clientId, emailAddress, execQuery, paramSnakeToCamel) => {
  const query = 'select * from access_info.access_token_list where client_id = $1 and email_address = $2'
  const paramList = [clientId, emailAddress]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }
  const { splitPermissionList: splitPermissionListStr } = paramSnakeToCamel(result.rows[0])
  const splitPermissionList = JSON.parse(splitPermissionListStr)

  const { required, optional } = splitPermissionList
  const permissionList = { ...required, ...optional }
  return permissionList
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


/* from notificationList */
/**
 * getNotification.
 *
 * @param {} emailAddress
 * @param {} notificationRange
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {Array} メールアドレスでDBから取得した通知一覧
 * @memberof input
 */
const getNotification = async (emailAddress, notificationRange, execQuery, paramSnakeToCamel) => {
  const queryGetLastOpenedNotificationId = 'select * from notification_info.opened_notification_list where email_address = $1 and notification_range = $2'
  const paramListGetLastOpenedNotificationId = [emailAddress, notificationRange]
  const { err: errGetLastOpenedNotificationId, result: resultGetLastOpenedNotificationId } = await execQuery(queryGetLastOpenedNotificationId, paramListGetLastOpenedNotificationId)
  let lastOpendNoticationId = '0'
  if (errGetLastOpenedNotificationId) {
    return null
  }
  if (!errGetLastOpenedNotificationId && resultGetLastOpenedNotificationId && resultGetLastOpenedNotificationId.rows[0]) {
    lastOpendNoticationId = paramSnakeToCamel(resultGetLastOpenedNotificationId.rows[0]).notificationId
  }


  let queryGetNotification = 'select * from notification_info.notification_list where email_address = $1 and notification_id > $2'
  const paramListGetNotification = [emailAddress, lastOpendNoticationId]
  if (notificationRange !== mod.setting.getValue('notification.ALL_NOTIFICATION')) {
    queryGetNotification += ' and notification_range = $3'
    paramListGetNotification.push(notificationRange)
  }

  const { err: errGetNotification, result: resultGetNotification } = await execQuery(queryGetNotification, paramListGetNotification)
  if (errGetNotification) {
    return null
  }
  const filteredNotificationList = {}
  if (resultGetNotification && resultGetNotification.rows) {
    resultGetNotification.rows.forEach((_row) => {
      const row = paramSnakeToCamel(_row)
      filteredNotificationList[row.notificationId] = row
    })
  }

  return filteredNotificationList
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
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} filePath
 * @return {Array} メールアドレスとファイルパスで取得したファイル内容
 * @memberof input
 */
const getFileList = async (emailAddress, clientId, owner, filePath) => {
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


export default {
  init,
  isValidClient,
  isValidSignature,

  getUserByEmailAddress,
  isValidCredential,

  getAuthSessionByCode,

  getUserByAccessToken,
  getCheckedRequiredPermissionList,

  checkPermissionAndGetEmailAddress,

  getNotification,

  getFileContent,
  getFileList,
}
