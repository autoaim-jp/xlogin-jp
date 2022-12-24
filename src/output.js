/* /output.js */
const mod = {}

const init = (setting, fs) => {
  mod.setting = setting

  mod.fs = fs
}

/* to userList */
const registerUserByEmailAddress = async (emailAddress, passPbkdf2, saltHex, userName, execQuery) => {
  const queryAddUser = 'insert into user_info.user_list (email_address, user_name) values ($1, $2)'
  const paramListAddUser = [emailAddress, userName]

  const { err: errAddUser, result: resultAddUser } = await execQuery(queryAddUser, paramListAddUser)
  const { rowCount: rowCountAddUser } = resultAddUser

  const queryAddCredential = 'insert into user_info.credential_list (email_address, pass_pbkdf2, salt_hex) values ($1, $2, $3)'
  const paramListAddCredential = [emailAddress, passPbkdf2, saltHex]

  const { err: errAddCredential, result: resultAddCredential } = await execQuery(queryAddCredential, paramListAddCredential)
  const { rowCount: rowCountAddCredential } = resultAddCredential

  return true
}

const registerServiceUserId = async (emailAddress, clientId, serviceUserId, execQuery) => {
  const query = 'insert into user_info.service_user_list (email_address, client_id, service_user_id) values ($1, $2, $3)'
  const paramList = [emailAddress, clientId, serviceUserId]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  return rowCount
}

const updateBackupEmailAddressByAccessToken = async (emailAddress, backupEmailAddress, execQuery) => {
  const query = 'insert into user_info.personal_data_list (email_address, backup_email_address) values ($1, $2) on conflict(email_address) do update set backup_email_address = $2'
  const paramList = [emailAddress, backupEmailAddress]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result
  return rowCount
}

/* to authSessionList */
const registerAuthSession = async (authSession, execQuery) => {
  const query = 'insert into access_info.auth_session_list (code, client_id, condition, code_challenge_method, code_challenge, email_address, split_permission_list) values ($1, $2, $3, $4, $5, $6, $7)'
  const { code, clientId, condition, codeChallengeMethod, codeChallenge, splitPermissionList } = authSession.oidc
  const { emailAddress } = authSession.user
  const paramList = [code, clientId, condition, codeChallengeMethod, codeChallenge, emailAddress, JSON.stringify(splitPermissionList)]
  const { err, result } = await execQuery(query, paramList)
  const { rowCount } =  result

  return rowCount
}

/* to accessTokenList */
const registerAccessToken = async (clientId, accessToken, emailAddress, splitPermissionList, execQuery) => {
  const splitPermissionListStr = JSON.stringify(splitPermissionList)
  const query = 'insert into access_info.access_token_list (access_token, client_id, email_address, split_permission_list) values ($1, $2, $3, $4)'
  const paramList = [accessToken, clientId, emailAddress, splitPermissionListStr]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result

  return rowCount
}

/* to notificationList */
const appendNotification = async (notificationId, clientId, emailAddress, subject, detail, execQuery) => {
  const dateRegistered = Date.now()
  const isOpened = 0
  const notificationRange = clientId
  const query = 'insert into notification_info.notification_list (notification_id, client_id, email_address, notification_range, date_registered, subject, detail, is_opened) values ($1, $2, $3, $4, $5, $6, $7, $8)'
  const paramList = [notificationId, clientId, emailAddress, notificationRange, dateRegistered, subject, detail, isOpened]

  const { err, result } = await execQuery(query, paramList)
  const { rowCount } = result

  return rowCount
}

const openNotification = async (notificationIdList, clientId, emailAddress, execQuery, getMaxIdInList) => {
  const lastOpendNoticationId = getMaxIdInList(notificationIdList)
  const notificationRange = clientId
  const queryUpdateLastOpenedNotificationId = 'insert into notification_info.opened_notification_list (email_address, notification_range, notification_id) values ($1, $2, $3) on conflict(email_address, notification_range) do update set notification_id = $3'
  const paramListUpdateLastOpenedNotificationId = [emailAddress, notificationRange, lastOpendNoticationId]
  const { err: errUpdateLastOpenedNotificationId, result: resultUpdateLastOpenedNotificationId } = await execQuery(queryUpdateLastOpenedNotificationId, paramListUpdateLastOpenedNotificationId)
  const { rowCount: rowCountUpdateLastOpenedNotificationId } =  resultUpdateLastOpenedNotificationId

  const queryUpdateNotificationIsOpened = 'update notification_info.notification_list set is_opened = true where notification_id in ($1)'
  const paramListUpdateNotificationIsOpened = [[notificationIdList]]

  const { err: errUpdateNotificationIsOpened, result: resultUpdateNotificationIsOpened } = await execQuery(queryUpdateNotificationIsOpened, paramListUpdateNotificationIsOpened)
  const { rowCount: rowCountUpdateNotificationIsOpened } =  resultUpdateNotificationIsOpened

  return rowCountUpdateNotificationIsOpened
}


/* to fileList */
const updateFile = async (emailAddress, clientId, owner, filePath, content) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.server.FILE_LIST_JSON))
  if (!fileList[emailAddress]) {
    fileList[emailAddress] = {}
  }

  if (!fileList[emailAddress][owner]) {
    fileList[emailAddress][owner] = {}
  }

  const dateUpdated = Date.now()
  fileList[emailAddress][owner][filePath] = { dateUpdated, clientId, content }

  mod.fs.writeFileSync(mod.setting.server.FILE_LIST_JSON, JSON.stringify(fileList, null, 2))
  return true
}

const deleteFile = async (emailAddress, clientId, owner, filePath) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.server.FILE_LIST_JSON))
  if (!fileList[emailAddress] || !fileList[emailAddress][owner] || !fileList[emailAddress][owner][filePath]) {
    return false
  }

  delete fileList[emailAddress][owner][filePath]

  mod.fs.writeFileSync(mod.setting.server.FILE_LIST_JSON, JSON.stringify(fileList, null, 2))
  return true
}


/* to http client */
const endResponse = (req, res, handleResult) => {
  console.log('endResponse:', req.url, handleResult.error)
  req.session.auth = handleResult.session

  if (handleResult.response) {
    return res.json(handleResult.response)
  }
  if (req.method === 'GET') {
    if (handleResult.redirect) {
      return res.redirect(handleResult.redirect)
    }
    return res.redirect(mod.setting.url.ERROR_PAGE)
  }
  if (handleResult.redirect) {
    return res.json({ redirect: handleResult.redirect })
  }
  return res.json({ redirect: mod.setting.url.ERROR_PAGE })
}

export default {
  init,

  registerUserByEmailAddress,
  registerServiceUserId,
  updateBackupEmailAddressByAccessToken,
  registerAuthSession,
  registerAccessToken,
  appendNotification,
  openNotification,
  updateFile,
  deleteFile,

  endResponse,
}

