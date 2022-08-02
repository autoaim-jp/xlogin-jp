/* /core.js */
/* local setting */
const mod = {}

const init = (setting, output, input, lib) => {
  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}


const _generageServiceUserId = () => {
  return mod.lib.getRandomB64UrlSafe(mod.setting.user.SERVICE_USER_ID_L)
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
const registerAccessToken = (clientId, accessToken, emailAddress, permissionList) => {
  return mod.output.registerAccessToken(clientId, accessToken, emailAddress, permissionList)
}

const getUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  return mod.input.getUserByAccessToken(clientId, accessToken, filterKeyList)
}


/* user */
const registerUserByEmailAddress = (emailAddress, user) => {
  return mod.output.registerUserByEmailAddress(emailAddress, user)
}

const registerServiceUserId = (emailAddress, clientId) => {
  return mod.output.registerServiceUserId(emailAddress, clientId, _generageServiceUserId())
}

const getUserByEmailAddress = (emailAddress) => {
  return mod.input.getUserByEmailAddress(emailAddress)
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
    const serviceUserId = _generageServiceUserId()
    user.serviceVariable[clientId] = { serviceUserId }
  }

  mod.output.registerUserByEmailAddress(emailAddress, user)

  return { registerResult: true }
}

/* notification */
const registerLoginNotification = (clientId, ipAddress, useragent, emailAddress) => {
  let detail = 'Login'
  detail += ` at ${mod.lib.formatDate(mod.setting.bsc.userReadableDateFormat.full)}`
  const subject = detail
  detail += ` with ${useragent.browser}(${useragent.platform})`
  detail += ` by ${clientId}`
  detail += ` from ${ipAddress}`
  mod.output.appendNotification(mod.setting.notification.AUTH_SERVER_CLIENT_ID, emailAddress, subject, detail)
}

const getNotification = (emailAddress, notificationRange) => {
  return mod.input.getNotification(emailAddress, notificationRange)
}

const getNotificationByAccessToken = (clientId, accessToken, notificationRange) => {
  return mod.input.getNotificationByAccessToken(clientId, accessToken, notificationRange)
}

const addNotificationByAccessToken = (clientId, accessToken, notificaitonRange, subject, detail) => {
  return mod.output.addNotificationByAccessToken(clientId, accessToken, notificationRange, subject, detail)
}

export default {
  init,
  
  isValidClient,

  registerAuthSession,
  getAuthSessionByCode,

  registerAccessToken,
  getUserByAccessToken,

  registerUserByEmailAddress,
  registerServiceUserId,
  getUserByEmailAddress,
  credentialCheck,
  addUser,

  registerLoginNotification,
  getNotification,
  getNotificationByAccessToken,
}
