/* /input.js */
import fs from 'fs'

const mod = {}

const init = (setting) => {
  mod.setting = setting
}

const isValidClient = (clientId, redirectUri) => {
  const clientList = JSON.parse(fs.readFileSync(mod.setting.server.CLIENT_LIST_JSON))
  return clientList[clientId] && clientList[clientId].redirectUri === decodeURIComponent(redirectUri)
}

const getUserByEmailAddress = (emailAddress) => {
  const userList = JSON.parse(fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  return userList[emailAddress]
}

const registerUserByEmailAddress = (emailAddress, user) => {
  const userList = JSON.parse(fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  if (userList[emailAddress]) {
    return false
  }
  userList[emailAddress] = user
  fs.writeFileSync(mod.setting.server.USER_LIST_JSON, JSON.stringify(userList, null, 2))
  return true
}



export default {
  init,
  isValidClient,

  getUserByEmailAddress,
  registerUserByEmailAddress,
}

