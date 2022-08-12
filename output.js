/* /output.js */
const mod = {}

const init = (setting, fs) => {
  mod.setting = setting

  mod.fs = fs

  mod.fs.writeFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON, JSON.stringify({ accessTokenList: {}, clientList: {} }, null, 2))
  mod.fs.writeFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON, '{}')
  mod.fs.writeFileSync(mod.setting.server.NOTIFICATION_LIST_JSON, '{}')
}

/* to userList */
const registerUserByEmailAddress = (emailAddress, user) => {
  const userList = JSON.parse(mod.fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  if (userList[emailAddress]) {
    return false
  }
  userList[emailAddress] = user
  mod.fs.writeFileSync(mod.setting.server.USER_LIST_JSON, JSON.stringify(userList, null, 2))
  return true
}

const registerServiceUserId = (emailAddress, clientId, serviceUserId) => {
  const userList = JSON.parse(mod.fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  if (userList[emailAddress] && userList[emailAddress][clientId]) {
    return false
  }
  userList[emailAddress][clientId] = { serviceUserId }
  mod.fs.writeFileSync(mod.setting.server.USER_LIST_JSON, JSON.stringify(userList, null, 2))
  return true
}

/* to authSessionList */
const registerAuthSession = (code, authSession) => {
  const authSessionList = JSON.parse(mod.fs.readFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON))
  if (authSessionList[code]) {
    return false
  }
  authSessionList[code] = authSession
  mod.fs.writeFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON, JSON.stringify(authSessionList, null, 2))
  return true
}

/* to accessTokenList */
const registerAccessToken = (clientId, accessToken, emailAddress, permissionList) => {
  const allAccessTokenList = JSON.parse(mod.fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))

  if (allAccessTokenList.accessTokenList[accessToken]) {
    return false
  }
  if (!allAccessTokenList.clientList[clientId]) {
    allAccessTokenList.clientList[clientId] = {}
  }

  allAccessTokenList.clientList[clientId][emailAddress] = { accessToken, permissionList }

  allAccessTokenList.accessTokenList[accessToken] = { clientId, emailAddress, permissionList }
  mod.fs.writeFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON, JSON.stringify(allAccessTokenList, null, 2))
  return true
}

/* to notificationList */
const appendNotification = (notificationId, clientId, emailAddress, subject, detail) => {
  const notificationList = JSON.parse(mod.fs.readFileSync(mod.setting.server.NOTIFICATION_LIST_JSON))
  if (!notificationList[emailAddress]) {
    notificationList[emailAddress] = { clientOpenNotificationIdList: {}, contentList: {} }
  }

  const dateRegistered = Date.now()

  notificationList[emailAddress].contentList[notificationId] = { clientId, subject, detail, dateRegistered, isOpen: false }

  mod.fs.writeFileSync(mod.setting.server.NOTIFICATION_LIST_JSON, JSON.stringify(notificationList, null, 2))
  return true
}

const openNotification = (notificationIdList, clientId, emailAddress) => {
  const notificationList = JSON.parse(mod.fs.readFileSync(mod.setting.server.NOTIFICATION_LIST_JSON))
  if (!notificationList[emailAddress]) {
    return false
  }

  notificationIdList.some((notificationId) => {
    if (notificationList[emailAddress].contentList[notificationId]) {
      notificationList[emailAddress].contentList[notificationId].isOpen = true
      const notificationClientId = notificationList[emailAddress].contentList[notificationId].clientId
      if(!notificationList[emailAddress].clientOpenNotificationIdList[notificationClientId] || notificationList[emailAddress].clientOpenNotificationIdList[notificationClientId] < notificationId) {
        notificationList[emailAddress].clientOpenNotificationIdList[notificationClientId] = notificationId
      }
    }
  })

  mod.fs.writeFileSync(mod.setting.server.NOTIFICATION_LIST_JSON, JSON.stringify(notificationList, null, 2))
  return true
}

/* to http client */
const endResponse = (req, res, handleResult) => {
  console.log('endResponse:', req.url, handleResult.error)
  req.session.auth = handleResult.session

  if (handleResult.response) {
    return res.json(handleResult.response)
  } else {
    if (req.method === 'GET') {
      if (handleResult.redirect) {
        return res.redirect(handleResult.redirect)
      } else {
        return res.redirect(mod.setting.url.ERROR_PAGE)
      }
    } else {
      if (handleResult.redirect) {
        return res.json({ redirect: handleResult.redirect })
      } else {
        return res.json({ redirect: mod.setting.url.ERROR_PAGE })
      }
    }
  }
}

export default {
  init,

  registerUserByEmailAddress,
  registerServiceUserId,
  registerAuthSession,
  registerAccessToken,
  appendNotification,
  openNotification,

  endResponse,
}

