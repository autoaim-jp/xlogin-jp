/* /input.js */
import fs from 'fs'

const mod = {}

const init = (setting) => {
  mod.setting = setting

  fs.writeFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON, '{}')
  fs.writeFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON, '{}')
}

/* clientList */
const isValidClient = (clientId, redirectUri) => {
  const clientList = JSON.parse(fs.readFileSync(mod.setting.server.CLIENT_LIST_JSON))
  return clientList[clientId] && clientList[clientId].redirectUri === decodeURIComponent(redirectUri)
}


/* userList */
const registerUserByEmailAddress = (emailAddress, user) => {
  const userList = JSON.parse(fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  if (userList[emailAddress]) {
    return false
  }
  userList[emailAddress] = user
  fs.writeFileSync(mod.setting.server.USER_LIST_JSON, JSON.stringify(userList, null, 2))
  return true
}

const getUserByEmailAddress = (emailAddress) => {
  const userList = JSON.parse(fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  return userList[emailAddress]
}


/* authSessionList */
const registerAuthSession = (code, authSession) => {
  const authSessionList = JSON.parse(fs.readFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON))
  if (authSessionList[code]) {
    return false
  }
  authSessionList[code] = authSession
  fs.writeFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON, JSON.stringify(authSessionList, null, 2))
  return true
}

const getAuthSessionByCode = (code) => {
  const authSessionList = JSON.parse(fs.readFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON))
  return authSessionList[code]
}


/* accessTokenList */
const registerAccessToken = (clientId, accessToken, user, permissionList) => {
  const accessTokenList = JSON.parse(fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))
  if (accessTokenList[accessToken]) {
    return false
  }
  accessTokenList[accessToken] = { clientId, user, permissionList }
  fs.writeFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON, JSON.stringify(accessTokenList, null, 2))
  return true
}

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



export default {
  init,
  isValidClient,

  registerUserByEmailAddress,
  getUserByEmailAddress,

  registerAuthSession,
  getAuthSessionByCode,

  registerAccessToken,
  getUserByAccessToken,
}

