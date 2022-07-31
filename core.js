/* /core.js */
/* local setting */
const mod = {}
const ACCESS_TOKEN_LIST = {}
const AUTH_SESSION_LIST = {}

const init = (setting, lib) => {
  mod.setting = setting
  mod.lib = lib
}

const registerAccessToken = (clientId, accessToken, user, permissionList) => {
  ACCESS_TOKEN_LIST[accessToken] = { clientId, user, permissionList }
  return true
}

const getAuthSessionByCode = (code) => {
  return AUTH_SESSION_LIST[code]
}

const registerAuthSession = (code, authSession) => {
  AUTH_SESSION_LIST[code] = authSession
}

const getUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  if (ACCESS_TOKEN_LIST[accessToken] && ACCESS_TOKEN_LIST[accessToken].clientId === clientId) {
    const { user, permissionList } = ACCESS_TOKEN_LIST[accessToken]
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

const credentialCheck = async (getUserByEmailAddress, emailAddress, passHmac2) => {
  const user = getUserByEmailAddress(emailAddress)
  if (!user) {
    return { credentialCheckResult: false }
  }

  const saltHex = user.saltHex

  const passPbkdf2 = await mod.lib.calcPbkdf2(passHmac2, saltHex)
  if(user.passPbkdf2 !== passPbkdf2) {
    return { credentialCheckResult: false }
  }

  return { credentialCheckResult: true }
}

const addUser = (getUserByEmailAddress, registerUserByEmailAddress, clientId, emailAddress, passPbkdf2, saltHex) => {
  if (getUserByEmailAddress(emailAddress)) {
    return { registerResult: false }
  }

  const user = {
    emailAddress,
    passPbkdf2,
    saltHex,
    userName: 'no name',
    serviceVariable: {}
  }

  if (clientId) {
    const serviceUserId = mod.lib.getRandomB64UrlSafe(mod.setting.user.SERVICE_USER_ID_L)
    user.serviceVariable[clientId] = { serviceUserId }
  }

  registerUserByEmailAddress(emailAddress, user)

  return { registerResult: true }
}


/* http */
const getErrorResponse = (status, error, isServerRedirect, response = null, session = {}) => {
  const redirect = `${mod.setting.url.ERROR_PAGE}?error=${encodeURIComponent(error)}`
  if (isServerRedirect) {
    return { status, session, response, redirect, error }
  } else {
    if (response) {
      return { status, session, response, error }
    } else {
      return { status, session, response: { status, error, redirect }, error }
    }
  }
}


export default {
  init,
  registerAccessToken,
  getAuthSessionByCode,
  registerAuthSession,
  getUserByAccessToken,
  credentialCheck,
  addUser,
  getErrorResponse,
}
