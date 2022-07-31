/* /output.js */
import fs from 'fs'

const mod = {}

const init = (setting) => {
  mod.setting = setting

  fs.writeFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON, '{}')
  fs.writeFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON, '{}')
}

/* to userList */
const registerUserByEmailAddress = (emailAddress, user) => {
  const userList = JSON.parse(fs.readFileSync(mod.setting.server.USER_LIST_JSON))
  if (userList[emailAddress]) {
    return false
  }
  userList[emailAddress] = user
  fs.writeFileSync(mod.setting.server.USER_LIST_JSON, JSON.stringify(userList, null, 2))
  return true
}

/* to authSessionList */
const registerAuthSession = (code, authSession) => {
  const authSessionList = JSON.parse(fs.readFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON))
  if (authSessionList[code]) {
    return false
  }
  authSessionList[code] = authSession
  fs.writeFileSync(mod.setting.server.AUTH_SESSION_LIST_JSON, JSON.stringify(authSessionList, null, 2))
  return true
}

/* to accessTokenList */
const registerAccessToken = (clientId, accessToken, user, permissionList) => {
  const accessTokenList = JSON.parse(fs.readFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON))
  if (accessTokenList[accessToken]) {
    return false
  }
  accessTokenList[accessToken] = { clientId, user, permissionList }
  fs.writeFileSync(mod.setting.server.ACCESS_TOKEN_LIST_JSON, JSON.stringify(accessTokenList, null, 2))
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
  registerAuthSession,
  registerAccessToken,

  endResponse,
}

