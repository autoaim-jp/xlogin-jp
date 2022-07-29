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

export default {
  init,
  isValidClient,
}

