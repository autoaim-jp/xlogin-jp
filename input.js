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


/* from accessTokenList, userList */
const getUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  const accessTokenList = JSON.parse(fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))
  const userList = JSON.parse(fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  if (accessTokenList[accessToken] && accessTokenList[accessToken].clientId === clientId) {
    const user = userList[accessTokenList[accessToken].emailAddress]
    const publicData = {}
    filterKeyList.forEach((key) => {
      const keySplit = key.split(':')
      if (keySplit.length !== 2) {
        console.log('[warn] invalid key:', key)
        return
      }
      const permission = `r:${key}`
      if (accessTokenList[accessToken].permissionList[permission]) {
        console.log({ keySplit })
        if (keySplit[0] === mod.setting.notification.AUTH_SERVER_CLIENT_ID) {
          publicData[key] = user[keySplit[1]]
        } else if (user.serviceVariable[keySplit[0]]) {
          publicData[key] = user.serviceVariable[keySplit[0]][keySplit[1]]
        }
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
    return (notificationList[emailAddress] || []).reverse()
  } else {
    return (notificationList[emailAddress].filter((row) => { return row.clientId === notificationRange }) || []).reverse()
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

