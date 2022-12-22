/* /core.js */
/**
 * @name コア機能を集約したファイル
 * @memberof file
 */

/* local setting */
const mod = {}

const init = (setting, output, input, lib) => {
  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}

const createPgPool = (pg) => {
  const dbCredential = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    max: 5,
    idleTimeoutMillis: 5 * 1000,
    connectionTimeoutMillis: 5 * 1000,
  }

  return new pg.Pool(dbCredential)
}

const _generageServiceUserId = () => {
  return mod.lib.getRandomB64UrlSafe(mod.setting.user.SERVICE_USER_ID_L)
}

/* client */
const isValidClient = (clientId, redirectUri) => {
  return mod.input.isValidClient(clientId, redirectUri, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}


/* authSession */
const registerAuthSession = (authSession) => {
  return mod.output.registerAuthSession(authSession, mod.lib.execQuery)
}

const getAuthSessionByCode = (code) => {
  return mod.input.getAuthSessionByCode(code, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}


/* accessToken */
const registerAccessToken = (clientId, accessToken, emailAddress, splitPermissionList) => {
  return mod.output.registerAccessToken(clientId, accessToken, emailAddress, splitPermissionList)
}

const getUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  return mod.input.getUserByAccessToken(clientId, accessToken, filterKeyList)
}

const getCheckedRequiredPermissionList = (clientId, emailAddress) => {
  return mod.input.getCheckedRequiredPermissionList(clientId, emailAddress)
}

const updateBackupEmailAddressByAccessToken = (clientId, accessToken, backupEmailAddress) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', mod.setting.server.AUTH_SERVER_CLIENT_ID, 'backupEmailAddress')

  if (!emailAddress) {
    return null
  }
  return mod.output.updateBackupEmailAddressByAccessToken(clientId, accessToken, emailAddress, backupEmailAddress)
}


/* user */
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

  const { saltHex } = user[mod.setting.server.AUTH_SERVER_CLIENT_ID]

  const passPbkdf2 = await mod.lib.calcPbkdf2(passHmac2, saltHex)
  if (user[mod.setting.server.AUTH_SERVER_CLIENT_ID].passPbkdf2 !== passPbkdf2) {
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
    },
  }

  mod.output.registerUserByEmailAddress(emailAddress, user)

  return { registerResult: true }
}

/* notification */
const appendLoginNotification = async (clientId, ipAddress, useragent, emailAddress) => {
  let detail = 'Login'
  detail += ` at ${mod.lib.formatDate(mod.setting.bsc.userReadableDateFormat.full)}`
  const subject = detail
  detail += ` with ${useragent.browser}(${useragent.platform})`
  detail += ` by ${clientId}`
  detail += ` from ${ipAddress}`

  const notificationId = mod.lib.getUlid()
  await mod.output.appendNotification(notificationId, mod.setting.server.AUTH_SERVER_CLIENT_ID, emailAddress, subject, detail, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}

const appendNotificationByAccessToken = async (clientId, accessToken, notificationRange, subject, detail) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', notificationRange, 'notification')

  if (!emailAddress) {
    return false
  }

  const notificationId = mod.lib.getUlid()

  await mod.output.appendNotification(notificationId, notificationRange, emailAddress, subject, detail, mod.lib.execQuery, mod.lib.paramSnakeToCamel, mod.lib.getMaxIdInList)
  return true
}

const openNotificationByAccessToken = async (clientId, accessToken, notificationRange, notificationIdList) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', notificationRange, 'notification')

  if (!emailAddress) {
    return false
  }

  await mod.output.openNotification(notificationIdList, notificationRange, emailAddress, mod.lib.execQuery, mod.lib.paramSnakeToCamel, mod.lib.getMaxIdInList)
  return true
}


const getNotification = async (emailAddress, notificationRange) => {
  return await mod.input.getNotification(emailAddress, notificationRange, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}

const getNotificationByAccessToken = async (clientId, accessToken, notificationRange) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', notificationRange, 'notification')

  if (!emailAddress) {
    return null
  }

  return await mod.input.getNotification(emailAddress, notificationRange, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}


/* file */
const updateFileByAccessToken = (clientId, accessToken, owner, filePath, content) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'file')

  if (!emailAddress) {
    return null
  }

  return mod.output.updateFile(emailAddress, clientId, owner, filePath, content)
}

const getFileContentByAccessToken = (clientId, accessToken, owner, filePath) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', owner, 'file')

  if (!emailAddress) {
    return null
  }

  return mod.input.getFileContent(emailAddress, clientId, owner, filePath)
}

const deleteFileByAccessToken = (clientId, accessToken, owner, filePath) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'file')

  if (!emailAddress) {
    return null
  }

  return mod.output.deleteFile(emailAddress, clientId, owner, filePath)
}

const getFileListByAccessToken = (clientId, accessToken, owner, filePath) => {
  const emailAddress = mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', owner, 'file')

  if (!emailAddress) {
    return null
  }

  return mod.input.getFileList(emailAddress, clientId, owner, filePath)
}


export default {
  init,
  createPgPool,

  isValidClient,

  registerAuthSession,
  getAuthSessionByCode,

  registerAccessToken,
  getUserByAccessToken,
  getCheckedRequiredPermissionList,
  updateBackupEmailAddressByAccessToken,

  registerServiceUserId,
  getUserByEmailAddress,
  credentialCheck,
  addUser,

  appendLoginNotification,
  appendNotificationByAccessToken,
  openNotificationByAccessToken,
  getNotification,
  getNotificationByAccessToken,

  updateFileByAccessToken,
  getFileContentByAccessToken,
  deleteFileByAccessToken,
  getFileListByAccessToken,
}

