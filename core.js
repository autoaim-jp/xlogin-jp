/* /core.js */
/* local setting */
const mod = {}

const init = (setting, output, input, lib) => {
  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}


/* client */
const isValidClient = (clientId, redirectUri) => {
  return mod.input.isValidClient(clientId, redirectUri)
}


/* authSession */
const registerAuthSession = (code, authSession) => {
  return mod.output.registerAuthSession(code, authSession)
}

const getAuthSessionByCode = (code) => {
  return mod.input.getAuthSessionByCode(code)
}

/* accessToken */
const getUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  return mod.input.getUserByAccessToken(clientId, accessToken, filterKeyList)
}

const registerAccessToken = (clientId, accessToken, user, permissionList) => {
  return mod.output.registerAccessToken(clientId, accessToken, user, permissionList)
}


/* user */
const getUserByEmailAddress = (emailAddress) => {
  return mod.input.getUserByEmailAddress(emailAddress)
}

const registerUserByEmailAddress = (emailAddress, user) => {
  return mod.output.registerUserByEmailAddress(emailAddress, user)
}

const credentialCheck = async (emailAddress, passHmac2) => {
  const user = mod.input.getUserByEmailAddress(emailAddress)
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

const addUser = (clientId, emailAddress, passPbkdf2, saltHex) => {
  if (mod.input.getUserByEmailAddress(emailAddress)) {
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

  mod.output.registerUserByEmailAddress(emailAddress, user)

  return { registerResult: true }
}

/* notification */
const registerLoginNotification = (ipAddress, useragent, emailAddress) => {
  let message = 'Login'
  message += ` at ${mod.lib.formatDate(mod.setting.bsc.userReadableDateFormat.full)}`
  message += ` with ${useragent.browser}(${useragent.platform})`
  message += ` from ${ipAddress}`
  mod.output.appendNotification(mod.setting.notification.AUTH_SERVER_CLIENT_ID, emailAddress, message)
}

const getNotification = (emailAddress, notificationRange) => {
  return mod.input.getNotification(emailAddress, notificationRange)
}

export default {
  init,
  
  isValidClient,

  registerAuthSession,
  getAuthSessionByCode,

  registerAccessToken,
  getUserByAccessToken,

  registerUserByEmailAddress,
  getUserByEmailAddress,
  credentialCheck,
  addUser,

  registerLoginNotification,
  getNotification,
}
