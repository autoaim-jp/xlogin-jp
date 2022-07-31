/* /input.js */
import fs from 'fs'

const mod = {}

const init = (setting) => {
  mod.setting = setting
}

/* from clientList */
const isValidClient = (clientId, redirectUri) => {
  const clientList = JSON.parse(fs.readFileSync(mod.setting.server.CLIENT_LIST_JSON))
  return clientList[clientId] && clientList[clientId].redirectUri === decodeURIComponent(redirectUri)
}


/* from userList */
const getUserByEmailAddress = (emailAddress) => {
  const userList = JSON.parse(fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  return userList[emailAddress]
}


/* from authSessionList */
const getAuthSessionByCode = (code) => {
  const authSessionList = JSON.parse(fs.readFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON))
  return authSessionList[code]
}


/* from accessTokenList */
const getUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  const accessTokenList = JSON.parse(fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))
  if (accessTokenList[accessToken] && accessTokenList[accessToken].clientId === clientId) {
    const { user, permissionList } = accessTokenList[accessToken]
    const publicData = {}
    filterKeyList.forEach((key) => {
      const permission = `r:${key}`
      if (permissionList[permission]) {
        publicData[key] = user[key] || user.serviceVariable[clientId][key]
      }
    })
    return { public: publicData }
  }

  return null
}

/* from notificationList */
const getNotification = (emailAddress, notificationRange) => {
  const notificationList = JSON.parse(fs.readFileSync(mod.setting.server.NOTIFICATION_LIST_JSON))
  if (notificationRange === mod.setting.notification.ALL_NOTIFICATION) {
    return notificationList[emailAddress]
  } else {
    return notificationList[emailAddress].filter((row) => { return row.clientId === notificationRange })
  }
}


export default {
  init,
  isValidClient,

  getUserByEmailAddress,

  getAuthSessionByCode,

  getUserByAccessToken,

  getNotification,
}

