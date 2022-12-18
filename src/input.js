/* /input.js */
const mod = {}

const init = (setting, fs) => {
  mod.setting = setting

  mod.fs = fs
}

/* from clientList */
const isValidClient = (clientId, redirectUri) => {
  const clientList = JSON.parse(mod.fs.readFileSync(mod.setting.server.CLIENT_LIST_JSON))
  return clientList[clientId] && clientList[clientId].redirectUri === decodeURIComponent(redirectUri)
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
const getUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  /* clientId, accessToken => emailAddress */
  const allAccessTokenList = JSON.parse(mod.fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))
  if (!allAccessTokenList.accessTokenList[accessToken] || allAccessTokenList.accessTokenList[accessToken].clientId !== clientId) {
    return null
  }
  const userList = JSON.parse(mod.fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  const user = userList[allAccessTokenList.accessTokenList[accessToken].emailAddress]
  const publicData = {}
  filterKeyList.forEach((key) => {
    const keySplit = key.split(':')
    if (keySplit.length !== 2) {
      console.log('[warn] invalid key:', key)
      return
    }
    if (_checkPermission(allAccessTokenList.accessTokenList[accessToken].splitPermissionList, 'r', keySplit[0], keySplit[1])) {
      if (user[keySplit[0]] && user[keySplit[0]][keySplit[1]] !== undefined) {
        publicData[key] = user[keySplit[0]][keySplit[1]]
      } else {
        publicData[key] = null
      }
    }
  })
  return { public: publicData }
}

/* from accessTokenList */
const getCheckedRequiredPermissionList = (clientId, emailAddress) => {
  /* clientId, emailAddress => accessToken(permissionList) */
  const allAccessTokenList = JSON.parse(mod.fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))

  let permissionList = null
  Object.entries(allAccessTokenList.clientList[clientId] || {}).some(([_emailAddress, row]) => {
    if (_emailAddress === emailAddress) {
      const { required, optional } = row.splitPermissionList
      permissionList = { ...required, ...optional }
      return true
    }
    return false
  })

  return permissionList
}

const checkPermissionAndGetEmailAddress = (accessToken, clientId, operationKey, range, dataType) => {
  /* accessToken, clientId => emailAddress */
  const allAccessTokenList = JSON.parse(mod.fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))
  if (!allAccessTokenList.accessTokenList[accessToken] || allAccessTokenList.accessTokenList[accessToken].clientId !== clientId) {
    return null
  }

  const isAuthorized = _checkPermission(allAccessTokenList.accessTokenList[accessToken].splitPermissionList, operationKey, range, dataType)
  if (!isAuthorized) {
    return null
  }

  return allAccessTokenList.accessTokenList[accessToken].emailAddress
}


/* from notificationList */
const getNotification = (emailAddress, notificationRange) => {
  const notificationList = JSON.parse(mod.fs.readFileSync(mod.setting.server.NOTIFICATION_LIST_JSON))
  if (notificationRange === mod.setting.notification.ALL_NOTIFICATION) {
    return notificationList[emailAddress]?.contentList || {}
  }
  if (!notificationList[emailAddress]) {
    return {}
  }
  const filteredNotificationList = {}
  const lastOpenNotificationId = notificationList[emailAddress].clientOpenNotificationIdList[notificationRange] || '0'
  Object.entries(notificationList[emailAddress]?.contentList || {}).forEach(([notificationId, row]) => {
    if (row.clientId === notificationRange && notificationId > lastOpenNotificationId) {
      filteredNotificationList[notificationId] = row
    }
  })

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

