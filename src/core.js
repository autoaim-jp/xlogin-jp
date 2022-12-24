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
const isValidClient = async (clientId, redirectUri) => {
  const isValidClient = await mod.input.isValidClient(clientId, redirectUri, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
  if (!isValidClient) {
    return { clientCheckResult: false }
  }

  return { clientCheckResult: true }
}

const isValidSignature = async (clientId, timestamp, path, requestBody, signature) => {
  const contentHash = mod.lib.calcSha256AsB64(JSON.stringify(requestBody))
  const dataToSign = `${timestamp}:${path}:${contentHash}`
  const isValidSignature = await mod.input.isValidSignature(clientId, dataToSign, signature, mod.lib.execQuery, mod.lib.paramSnakeToCamel, mod.lib.calcSha256HmacAsB64)
  if (!isValidSignature) {
    return { signatureCheckResult: false }
  }

  return { signatureCheckResult: true }
}


/* authSession */
const registerAuthSession = async (authSession) => {
  return await mod.output.registerAuthSession(authSession, mod.lib.execQuery)
}

const getAuthSessionByCode = async (code) => {
  return await mod.input.getAuthSessionByCode(code, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}


/* accessToken */
const registerAccessToken = async (clientId, accessToken, emailAddress, splitPermissionList) => {
  return await mod.output.registerAccessToken(clientId, accessToken, emailAddress, splitPermissionList, mod.lib.execQuery)
}

const getUserByAccessToken = async (clientId, accessToken, filterKeyList) => {
  return await mod.input.getUserByAccessToken(clientId, accessToken, filterKeyList, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}

const getCheckedRequiredPermissionList = async (clientId, emailAddress) => {
  return await mod.input.getCheckedRequiredPermissionList(clientId, emailAddress, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}

const updateBackupEmailAddressByAccessToken = async (clientId, accessToken, backupEmailAddress) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', mod.setting.server.AUTH_SERVER_CLIENT_ID, 'backupEmailAddress', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    return null
  }
  return await mod.output.updateBackupEmailAddressByAccessToken(emailAddress, backupEmailAddress, mod.lib.execQuery)
}


/* user */
const registerServiceUserId = async (emailAddress, clientId) => {
  return await mod.output.registerServiceUserId(emailAddress, clientId, _generageServiceUserId(), mod.lib.execQuery)
}

const getUserByEmailAddress = async (emailAddress) => {
  return await mod.input.getUserByEmailAddress(emailAddress, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}


const credentialCheck = async (emailAddress, passHmac2) => {
  const user = await mod.input.getUserByEmailAddress(emailAddress, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
  if (!user) {
    return { credentialCheckResult: false }
  }

  const isValidCredential = await mod.input.isValidCredential(emailAddress, passHmac2, mod.lib.execQuery, mod.lib.paramSnakeToCamel, mod.lib.calcPbkdf2)

  if (!isValidCredential) {
    return { credentialCheckResult: false }
  }

  return { credentialCheckResult: true }
}

const addUser = async (clientId, emailAddress, passPbkdf2, saltHex) => {
  if (await mod.input.getUserByEmailAddress(emailAddress, mod.lib.execQuery, mod.lib.paramSnakeToCamel)) {
    return { registerResult: false }
  }

  const userName = mod.setting.user.DEFAULT_USER_NAME
  await mod.output.registerUserByEmailAddress(emailAddress, passPbkdf2, saltHex, userName, mod.lib.execQuery)

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
  await mod.output.appendNotification(notificationId, mod.setting.server.AUTH_SERVER_CLIENT_ID, emailAddress, subject, detail, mod.lib.execQuery)
}

const appendNotificationByAccessToken = async (clientId, accessToken, notificationRange, subject, detail) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', notificationRange, 'notification', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    return false
  }

  const notificationId = mod.lib.getUlid()

  await mod.output.appendNotification(notificationId, notificationRange, emailAddress, subject, detail, mod.lib.execQuery, mod.lib.getMaxIdInList)
  return true
}

const openNotificationByAccessToken = async (clientId, accessToken, notificationRange, notificationIdList) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', notificationRange, 'notification', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    return false
  }

  await mod.output.openNotification(notificationIdList, notificationRange, emailAddress, mod.lib.execQuery, mod.lib.getMaxIdInList)
  return true
}


const getNotification = async (emailAddress, notificationRange) => {
  return await mod.input.getNotification(emailAddress, notificationRange, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}

const getNotificationByAccessToken = async (clientId, accessToken, notificationRange) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', notificationRange, 'notification', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    return null
  }

  return await mod.input.getNotification(emailAddress, notificationRange, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
}


/* file */
const updateFileByAccessToken = async (clientId, accessToken, owner, filePath, content) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'file', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    return null
  }

  return await mod.output.updateFile(emailAddress, clientId, owner, filePath, content)
}

const getFileContentByAccessToken = async (clientId, accessToken, owner, filePath) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', owner, 'file', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    return null
  }

  return await mod.input.getFileContent(emailAddress, clientId, owner, filePath)
}

const deleteFileByAccessToken = async (clientId, accessToken, owner, filePath) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'file', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    return null
  }

  return await mod.output.deleteFile(emailAddress, clientId, owner, filePath)
}

const getFileListByAccessToken = async (clientId, accessToken, owner, filePath) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', owner, 'file', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    return null
  }

  return await mod.input.getFileList(emailAddress, clientId, owner, filePath)
}


export default {
  init,
  createPgPool,

  isValidClient,
  isValidSignature,

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

