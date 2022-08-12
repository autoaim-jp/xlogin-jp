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
const getAuthSessionByCode = (code) => {
  const authSessionList = JSON.parse(mod.fs.readFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON))
  return authSessionList[code]
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
      if (user[keySplit[0]]) {
        publicData[key] = user[keySplit[0]][keySplit[1]]
      }
    }
  })
  return { public: publicData }
}

const getCheckedRequiredPermissionList = (clientId, emailAddress) => {
  /* clientId, emailAddress => accessToken(permissionList) */
  const allAccessTokenList = JSON.parse(mod.fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))

  let permissionList = null
  Object.entries(allAccessTokenList.clientList[clientId] || {}).some(([_emailAddress, row]) => {
    if (_emailAddress === emailAddress) {
      const { required, optional } = row.splitPermissionList
      permissionList = Object.assign({}, required, optional)
      return true
    }
    return false
  })

  return permissionList
}

/* from accessTokenList */
const _checkPermission = (splitPermissionList, operationKey, range, dataType) => {
  const { required, optional } = splitPermissionList
  const permissionList = Object.assign({}, required, optional)
  const isAuthorized = Object.entries(permissionList).some(([key, isChecked]) => {
    if (!isChecked) {
      return false
    }
    const keySplit = key.split(':')
    if (keySplit.length !== 3) {
      console.log('[warn] invalid key:', key)
      return false
    }

    if (keySplit[0].indexOf('r') < 0) {
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
  } else {
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
}

