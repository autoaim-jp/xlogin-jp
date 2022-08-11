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

  const saltHex = user[mod.setting.server.AUTH_SERVER_CLIENT_ID].saltHex

  const passPbkdf2 = await mod.lib.calcPbkdf2(passHmac2, saltHex)
  if(user[mod.setting.server.AUTH_SERVER_CLIENT_ID].passPbkdf2 !== passPbkdf2) {
    return { credentialCheckResult: false }
  }

  return { credentialCheckResult: true }
}

const addUser = (clientId, emailAddress, passPbkdf2, saltHex) => {
  if (mod.input.getUserByEmailAddress(emailAddress)) {
    return { registerResult: false }
  }

  const user = {
    auth: {
      emailAddress,
      passPbkdf2,
      saltHex,
      userName: 'no name',
    }
  }

  mod.output.registerUserByEmailAddress(emailAddress, user)

  return { registerResult: true }
}

/* notification */
const appendLoginNotification = (clientId, ipAddress, useragent, emailAddress) => {
  let detail = 'Login'
  detail += ` at ${mod.lib.formatDate(mod.setting.bsc.userReadableDateFormat.full)}`
  const subject = detail
  detail += ` with ${useragent.browser}(${useragent.platform})`
  detail += ` by ${clientId}`
  detail += ` from ${ipAddress}`

  const notificationId = mod.lib.getUlid()
  mod.output.appendNotification(notificationId, mod.setting.server.AUTH_SERVER_CLIENT_ID, emailAddress, subject, detail)
}

const appendNotificationByAccessToken = (clientId, accessToken, notificationRange, subject, detail) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'a', notificationRange, 'notification')

  if (!emailAddress) {
    return false
  }

  const notificationId = mod.lib.getUlid()

  return mod.output.appendNotification(notificationId, notificationRange, emailAddress, subject, detail)
}

const getNotification = (emailAddress, notificationRange) => {
  return mod.input.getNotification(emailAddress, notificationRange)
}

const getNotificationByAccessToken = (clientId, accessToken, notificationRange) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', notificationRange, 'notification')

  if (!emailAddress) {
    return null
  }

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
  registerServiceUserId,
  getUserByEmailAddress,
  credentialCheck,
  addUser,

  appendLoginNotification,
  appendNotificationByAccessToken,
  getNotification,
  getNotificationByAccessToken,
}
