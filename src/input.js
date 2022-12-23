/* /input.js */
const mod = {}

const init = (setting, fs) => {
  mod.setting = setting

  mod.fs = fs
}

/* from clientList */
const isValidClient = async (clientId, redirectUri, execQuery, paramSnakeToCamel) => {
  const query = 'select * from access_info.client_list where client_id = $1 and redirect_uri = $2'
  const paramList = [clientId, decodeURIComponent(redirectUri)]

  const { err, result } = await execQuery(query, paramList)
  const client = paramSnakeToCamel(result.rows[0])

  return client
}

/* from userList */
const getUserByEmailAddress = (emailAddress) => {
  const userList = JSON.parse(mod.fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  return userList[emailAddress]
}


/* from authSessionList */
const getAuthSessionByCode = async (code, execQuery, paramSnakeToCamel) => {
  const query = 'select * from access_info.auth_session_list where code = $1'
  const paramList = [code]

  const { err, result } = await execQuery(query, paramList)
  const authSession = paramSnakeToCamel(result.rows[0])

  return authSession
}

/* from accessTokenList */
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
const getUserByAccessToken = async(clientId, accessToken, filterKeyList, execQuery, paramSnakeToCamel) => {
  /* clientId, accessToken => emailAddress */
  const queryGetEmailAddress = 'select * from access_info.access_token_list where client_id = $1 and access_token = $2'
  const paramListGetEmailAddress = [clientId, accessToken]

  const { err: errGetEmailAddress, result: resultGetEmailAddress } = await execQuery(queryGetEmailAddress, paramListGetEmailAddress)
  const { emailAddress, splitPermissionList: splitPermissionListStr } = paramSnakeToCamel(resultGetEmailAddress.rows[0])
  const splitPermissionList = JSON.parse(splitPermissionListStr)

  /* emailAddress => userInfo */
  const publicData = {}
  for await (const key of filterKeyList) {
    const keySplit = key.split(':')
    if (keySplit.length !== 2) {
      console.log('[warn] invalid key:', key)
      return
    }
    if (_checkPermission(splitPermissionList, 'r', keySplit[0], keySplit[1])) {
      if (keySplit[0] === mod.setting.server.AUTH_SERVER_CLIENT_ID && keySplit[1] === 'userName') {
        const queryGetUserInfo = 'select * from user_info.user_list where email_address = $1'
        const paramListGetUserInfo = [emailAddress]

        const { err: errGetUserInfo, result: resultGetUserInfo } = await execQuery(queryGetUserInfo, paramListGetUserInfo)
        const { userName } = paramSnakeToCamel(resultGetUserInfo.rows[0])
        publicData[key] = userName
      } else if (keySplit[1] === 'serviceUserId') {
        const dataClientId = keySplit[0]
        const queryGetServiceUserInfo = 'select * from user_info.service_user_list where email_address = $1 and client_id = $2'
        const paramListGetServiceUserInfo = [emailAddress, dataClientId]

        const { err: errGetServiceUserInfo, result: resultGetServiceUserInfo } = await execQuery(queryGetServiceUserInfo, paramListGetServiceUserInfo)
        const { serviceUserId } = paramSnakeToCamel(resultGetServiceUserInfo.rows[0])
        publicData[key] = serviceUserId
      } else {
        publicData[key] = null
      }
    }

  }

  return { public: publicData }
}

const getCheckedRequiredPermissionList = async (clientId, emailAddress, execQuery, paramSnakeToCamel) => {
  const query = 'select * from access_info.access_token_list where client_id = $1 and access_token = $2'
  const paramList = [clientId, accessToken]

  const { err, result } = await execQuery(query, paramList)
  const { splitPermissionList: splitPermissionListStr } = paramSnakeToCamel(result.rows[0])
  const splitPermissionList = JSON.parse(splitPermissionListStr)

  const { required, optional } = splitPermissionList
  const permissionList = { ...required, ...optional }
  return permissionList
}

const checkPermissionAndGetEmailAddress = async (accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel) => {
  const query = 'select * from access_info.access_token_list where client_id = $1 and access_token = $2'
  const paramList = [clientId, accessToken]

  const { err, result } = await execQuery(query, paramList)
  const { emailAddress, splitPermissionList: splitPermissionListStr } = paramSnakeToCamel(resultGetEmailAddress.rows[0])
  const splitPermissionList = JSON.parse(splitPermissionListStr)
  const isAuthorized = _checkPermission(splitPermissionList, operationKey, range, dataType)
  if (!isAuthorized) {
    return null
  }

  return emailAddress
}


/* from notificationList */
const getNotification = async (emailAddress, notificationRange, execQuery, paramSnakeToCamel) => {
  const queryGetLastOpenedNotificationId = 'select * from notification_info.opened_notification_list where email_address = $1 and notification_range = $2'
  const paramListGetLastOpenedNotificationId = [emailAddress, notificationRange]
  const { err: errGetLastOpenedNotificationId, result: resultGetLastOpenedNotificationId } = await execQuery(queryGetLastOpenedNotificationId, paramListGetLastOpenedNotificationId)
  let lastOpendNoticationId = '0'
  if (!errGetLastOpenedNotificationId && resultGetLastOpenedNotificationId && resultGetLastOpenedNotificationId.rows[0]) {
    lastOpendNoticationId = paramSnakeToCamel(resultGetLastOpenedNotificationId.rows[0]).notificationId
  }


  let queryGetNotification = 'select * from notification_info.notification_list where email_address = $1 and notification_id > $2'
  const paramListGetNotification = [emailAddress, lastOpendNoticationId]
  if (notificationRange !== mod.setting.notification.ALL_NOTIFICATION) {
    queryGetNotification += ' and notification_range = $3'
    paramListGetNotification.push(notificationRange)
  }

  const { err: errGetNotification, result: resultGetNotification } = await execQuery(queryGetNotification, paramListGetNotification)
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
const getFileContent = (emailAddress, clientId, owner, filePath) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.server.FILE_LIST_JSON))
  if (!fileList[emailAddress] || !fileList[emailAddress][owner] || !fileList[emailAddress][owner][filePath]) {
    return null
  }

  return fileList[emailAddress][owner][filePath].content
}

const getFileList = (emailAddress, clientId, owner, filePath) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.server.FILE_LIST_JSON))
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

  getUserByEmailAddress,

  getAuthSessionByCode,

  getUserByAccessToken,
  getCheckedRequiredPermissionList,

  checkPermissionAndGetEmailAddress,

  getNotification,

  getFileContent,
  getFileList,
}

