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
const registerAccessToken = (clientId, accessToken, emailAddress, splitPermissionList) => {
  const allAccessTokenList = JSON.parse(mod.fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))

  if (allAccessTokenList.accessTokenList[accessToken]) {
    return false
  }
  if (!allAccessTokenList.clientList[clientId]) {
    allAccessTokenList.clientList[clientId] = {}
  }

  allAccessTokenList.clientList[clientId][emailAddress] = { accessToken, splitPermissionList }

  allAccessTokenList.accessTokenList[accessToken] = { clientId, emailAddress, splitPermissionList }
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

  const notification = {
    clientId, subject, detail, dateRegistered, isOpen: false,
  }
  notificationList[emailAddress].contentList[notificationId] = notification

  mod.fs.writeFileSync(mod.setting.server.NOTIFICATION_LIST_JSON, JSON.stringify(notificationList, null, 2))
  return true
}

const openNotification = (notificationIdList, clientId, emailAddress) => {
  const notificationList = JSON.parse(mod.fs.readFileSync(mod.setting.server.NOTIFICATION_LIST_JSON))
  if (!notificationList[emailAddress]) {
    return false
  }

  notificationIdList.forEach((notificationId) => {
    if (notificationList[emailAddress].contentList[notificationId]) {
      notificationList[emailAddress].contentList[notificationId].isOpen = true
      const notificationClientId = notificationList[emailAddress].contentList[notificationId].clientId
      if (!notificationList[emailAddress].clientOpenNotificationIdList[notificationClientId] || notificationList[emailAddress].clientOpenNotificationIdList[notificationClientId] < notificationId) {
        notificationList[emailAddress].clientOpenNotificationIdList[notificationClientId] = notificationId
      }
    }
  })

  mod.fs.writeFileSync(mod.setting.server.NOTIFICATION_LIST_JSON, JSON.stringify(notificationList, null, 2))
  return true
}


/* to fileList */
const updateFile = (emailAddress, clientId, owner, filePath, content) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.server.FILE_LIST_JSON))
  if (!fileList[emailAddress]) {
    fileList[emailAddress] = {}
  }

  if (!fileList[emailAddress][owner]) {
    fileList[emailAddress][owner] = {}
  }

  const dateUpdated = Date.now()
  fileList[emailAddress][owner][filePath] = { dateUpdated, clientId, content, }

  mod.fs.writeFileSync(mod.setting.server.FILE_LIST_JSON, JSON.stringify(fileList, null, 2))
  return true
}

const deleteFile = (emailAddress, clientId, owner, filePath) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.server.FILE_LIST_JSON))
  if (!fileList[emailAddress] || !fileList[emailAddress][owner] || !fileList[emailAddress][owner][filePath]) {
    return false
  }

  delete fileList[emailAddress][owner][filePath]

  mod.fs.writeFileSync(mod.setting.server.FILE_LIST_JSON, JSON.stringify(fileList, null, 2))
  return true
}


/* to http client */
const endResponse = (req, res, handleResult) => {
  console.log('endResponse:', req.url, handleResult.error)
  req.session.auth = handleResult.session

  if (handleResult.response) {
    return res.json(handleResult.response)
  }
  if (req.method === 'GET') {
    if (handleResult.redirect) {
      return res.redirect(handleResult.redirect)
    }
    return res.redirect(mod.setting.url.ERROR_PAGE)
  }
  if (handleResult.redirect) {
    return res.json({ redirect: handleResult.redirect })
  }
  return res.json({ redirect: mod.setting.url.ERROR_PAGE })
}

export default {
  init,

  registerUserByEmailAddress,
  registerServiceUserId,
  registerAuthSession,
  registerAccessToken,
  appendNotification,
  openNotification,
  updateFile,
  deleteFile,

  endResponse,
}

