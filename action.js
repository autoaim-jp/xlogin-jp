/* /action.js */
const mod = {}

const init = (setting, lib) => {
  mod.setting = setting
  mod.lib = lib
}

/* http */
const _getErrorResponse = (status, error, isServerRedirect, response = null, session = {}) => {
  const redirect = `${mod.setting.url.ERROR_PAGE}?error=${encodeURIComponent(error)}`
  if (isServerRedirect) {
    return {
      status, session, response, redirect, error,
    }
  }
  if (response) {
    return {
      status, session, response, error,
    }
  }
  return {
    status, session, response: { status, error, redirect }, error,
  }
}


/* GET /api/$apiVersion/auth/connect */
const handleConnect = (user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, isValidClient) => {
  if (!isValidClient(clientId, redirectUri)) {
    const status = mod.setting.bsc.statusList.INVALID_CLIENT
    const error = 'handle_connect_client'
    return _getErrorResponse(status, error, true)
  }

  if (user) {
    const condition = mod.setting.condition.CONFIRM
    const newUserSession = {
      oidc: {
        clientId, condition, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri,
      },
      user,
    }
    const redirect = mod.setting.url.AFTER_CHECK_CREDENTIAL

    const status = mod.setting.bsc.statusList.OK
    return {
      status, session: newUserSession, response: null, redirect,
    }
  }
  const condition = mod.setting.condition.LOGIN
  const newUserSession = {
    oidc: {
      clientId, condition, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri,
    },
  }

  const status = mod.setting.bsc.statusList.OK
  const redirect = mod.setting.url.AFTER_CONNECT
  return {
    status, session: newUserSession, response: null, redirect,
  }
}

/* POST /f/$condition/credential/check */
const handleCredentialCheck = async (emailAddress, passHmac2, authSession, credentialCheck, getUserByEmailAddress) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.setting.bsc.statusList.INVALID_SESSION
    const error = 'handle_credential_session'
    return _getErrorResponse(status, error, false)
  }

  const resultCredentialCheck = await credentialCheck(emailAddress, passHmac2)
  if (resultCredentialCheck.credentialCheckResult !== true) {
    const status = mod.setting.bsc.statusList.INVALID_CREDENTIAL
    const error = 'handle_credential_credential'
    return _getErrorResponse(status, error, false, null, authSession)
  }

  const user = getUserByEmailAddress(emailAddress)


  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.condition.CONFIRM }) }, { user })
  const redirect = mod.setting.url.AFTER_CHECK_CREDENTIAL

  const status = mod.setting.bsc.statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* after /f/confirm/ */
const _afterCheckPermission = (ipAddress, useragent, authSession, registerAuthSession, appendLoginNotification, registerServiceUserId, splitPermissionList) => {
  appendLoginNotification(authSession.oidc.clientId, ipAddress, useragent, authSession.user[mod.setting.server.AUTH_SERVER_CLIENT_ID].emailAddress)
  registerServiceUserId(authSession.user[mod.setting.server.AUTH_SERVER_CLIENT_ID].emailAddress, authSession.oidc.clientId)

  const code = mod.lib.getRandomB64UrlSafe(mod.setting.oidc.CODE_L)

  const iss = process.env.SERVER_ORIGIN
  const { redirectUri, state } = authSession.oidc
  const redirect = mod.lib.addQueryStr(decodeURIComponent(redirectUri), mod.lib.objToQuery({ state, code, iss }))

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.condition.CODE, code, splitPermissionList }) })

  registerAuthSession(code, newUserSession)

  const status = mod.setting.bsc.statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* POST /f/confirm/permission/check */
const handleConfirm = (ipAddress, useragent, permissionList, authSession, registerAuthSession, appendLoginNotification, registerServiceUserId) => {
  if (!authSession || !authSession.oidc || authSession.oidc.condition !== mod.setting.condition.CONFIRM) {
    const status = mod.setting.bsc.statusList.INVALID_SESSION
    const error = 'handle_confirm_session'
    return _getErrorResponse(status, error, false)
  }

  const { scope } = authSession.oidc
  let uncheckedRequiredPermissionExists = false
  const splitPermissionList = { required: {}, optional: {} }
  scope.split(',').forEach((_key) => {
    let key = _key
    if (_key[0] === '*') {
      key = _key.slice(1)
      splitPermissionList.required[key] = permissionList[key]
      if (!permissionList[key]) {
        uncheckedRequiredPermissionExists = true
      }
    } else {
      splitPermissionList.optional[key] = permissionList[key]
    }
  })

  if (uncheckedRequiredPermissionExists) {
    const status = mod.setting.bsc.statusList.NOT_ENOUGH_PARAM
    const result = { isRequiredScopeChecked: false }
    return { status, session: authSession, response: { result } }
  }

  return _afterCheckPermission(ipAddress, useragent, authSession, registerAuthSession, appendLoginNotification, registerServiceUserId, splitPermissionList)
}

/* POST /f/confirm/through/check */
const handleThrough = (ipAddress, useragent, authSession, registerAuthSession, appendLoginNotification, registerServiceUserId, getCheckedRequiredPermissionList) => {
  if (!authSession || !authSession.oidc || authSession.oidc.condition !== mod.setting.condition.CONFIRM) {
    const status = mod.setting.bsc.statusList.INVALID_SESSION
    const error = 'handle_confirm_session'
    return _getErrorResponse(status, error, false)
  }

  const permissionList = getCheckedRequiredPermissionList(authSession.oidc.clientId, authSession.user[mod.setting.server.AUTH_SERVER_CLIENT_ID].emailAddress)

  if (!permissionList) {
    const status = mod.setting.bsc.statusList.NOT_FOUND
    const result = { oldPermissionList: null }
    return { status, session: authSession, response: { result } }
  }

  const { scope } = authSession.oidc
  let uncheckedPermissionExists = false
  const splitPermissionList = { required: {}, optional: {} }
  scope.split(',').forEach((_key) => {
    let key = _key
    if (_key[0] === '*') {
      key = _key.slice(1)
      splitPermissionList.required[key] = permissionList[key]
    } else {
      splitPermissionList.optional[key] = permissionList[key]
    }

    if (!permissionList[key]) {
      uncheckedPermissionExists = true
    }
  })

  if (uncheckedPermissionExists) {
    const status = mod.setting.bsc.statusList.NOT_ENOUGH_PARAM
    const result = { oldPermissionList: permissionList }
    return { status, session: authSession, response: { result } }
  }

  return _afterCheckPermission(ipAddress, useragent, authSession, registerAuthSession, appendLoginNotification, registerServiceUserId, splitPermissionList)
}


/* GET /api/$apiVersion/auth/code */
const handleCode = (clientId, state, code, codeVerifier, registerAccessToken, getAuthSessionByCode) => {
  const authSession = getAuthSessionByCode(code)
  if (!authSession || !authSession.oidc || authSession.oidc.condition !== mod.setting.condition.CODE) {
    const status = mod.setting.bsc.statusList.INVALID_SESSION
    const error = 'handle_code_session'
    return _getErrorResponse(status, error, true)
  }

  if (clientId !== authSession.oidc.clientId) {
    const status = mod.setting.bsc.statusList.INVALID_CLIENT
    const error = 'handle_code_client'
    return _getErrorResponse(status, error, true)
  }

  const generatedCodeChallenge = mod.lib.convertToCodeChallenge(codeVerifier, authSession.oidc.codeChallengeMethod)
  if (authSession.oidc.codeChallenge !== generatedCodeChallenge) {
    const status = mod.setting.bsc.statusList.INVALID_CODE_VERIFIER
    const error = 'handle_code_challenge'
    return _getErrorResponse(status, error, true)
  }

  const accessToken = mod.lib.getRandomB64UrlSafe(mod.setting.oidc.ACCESS_TOKEN_L)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.condition.USER_INFO }) })

  const resultRegisterAccessToken = registerAccessToken(clientId, accessToken, authSession.user[mod.setting.server.AUTH_SERVER_CLIENT_ID].emailAddress, authSession.oidc.splitPermissionList)
  if (!resultRegisterAccessToken) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_code_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: newUserSession, response: { result: { accessToken } }, redirect: null,
  }
}

/* GET /api/$apiVersion/user/info */
const handleUserInfo = (clientId, accessToken, filterKeyListStr, getUserByAccessToken) => {
  const filterKeyList = filterKeyListStr.split(',')
  const userInfo = getUserByAccessToken(clientId, accessToken, filterKeyList)

  if (!userInfo) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_user_info_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: null, response: { result: { userInfo } }, redirect: null,
  }
}

/* GET /api/$apiVersion/notification/list */
const handleNotification = (clientId, accessToken, notificationRange, getNotificationByAccessToken) => {
  const notificationList = getNotificationByAccessToken(clientId, accessToken, notificationRange)

  if (!notificationList) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_notification_list_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: null, response: { result: { notificationList } }, redirect: null,
  }
}

/* POST /api/$apiVersion/notification/append */
const handleNotificationAppend = (clientId, accessToken, notificationRange, subject, detail, appendNotificationByAccessToken) => {
  const notificationAppendResult = appendNotificationByAccessToken(clientId, accessToken, notificationRange, subject, detail)

  if (!notificationAppendResult) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_notification_append_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: null, response: { result: { notificationAppendResult } }, redirect: null,
  }
}

/* POST /api/$apiVersion/notification/open */
const handleNotificationOpen = (clientId, accessToken, notificationRange, notificationIdList, openNotificationByAccessToken) => {
  const notificationOpenResult = openNotificationByAccessToken(clientId, accessToken, notificationRange, notificationIdList)

  if (!notificationOpenResult) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_notification_open_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: null, response: { result: { notificationOpenResult } }, redirect: null,
  }
}

/* POST /f/login/user/add */
const handleUserAdd = (emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, authSession, addUser, getUserByEmailAddress) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.setting.bsc.statusList.INVALID_SESSION
    const error = 'handle_user_add_session'
    return _getErrorResponse(status, error, false)
  }

  if (isTosChecked !== true || isPrivacyPolicyChecked !== true) {
    const status = mod.setting.bsc.statusList.INVALID_CHECK
    const error = 'handle_user_add_checkbox'
    return _getErrorResponse(status, error, false, null, authSession)
  }

  const { clientId } = authSession.oidc
  const resultAddUser = addUser(clientId, emailAddress, passPbkdf2, saltHex)

  if (resultAddUser.registerResult !== true) {
    const status = mod.setting.bsc.statusList.REGISTER_FAIL
    const error = 'handle_user_add_register'
    return _getErrorResponse(status, error, false, null, authSession)
  }

  const user = getUserByEmailAddress(emailAddress)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.condition.CONFIRM }) }, { user })
  const redirect = mod.setting.url.AFTER_CHECK_CREDENTIAL

  const status = mod.setting.bsc.statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* GET /f/confirm/scope/list */
const handleScope = (authSession) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.setting.bsc.statusList.INVALID_SESSION
    const error = 'handle_permission_list_session'
    return _getErrorResponse(status, error, false)
  }

  const { scope } = authSession.oidc
  const status = mod.setting.bsc.statusList.OK

  return {
    status, session: authSession, response: { result: { scope } },
  }
}

/* GET /f/notification/global/list */
const handleGlobalNotification = (authSession, getNotification) => {
  if (!authSession) {
    const status = mod.setting.bsc.statusList.INVALID_SESSION
    const error = 'handle_notification_list_session'
    return _getErrorResponse(status, error, false)
  }

  const globalNotificationList = getNotification(authSession.user[mod.setting.server.AUTH_SERVER_CLIENT_ID].emailAddress, mod.setting.notification.ALL_NOTIFICATION)
  const status = mod.setting.bsc.statusList.OK

  return {
    status, session: authSession, response: { result: { globalNotificationList } },
  }
}

/* POST /api/$apiVersion/file/update */
const handleFileUpdate = (clientId, accessToken, owner, filePath, content, updateFileByAccessToken) => {
  const updateFileResult = updateFileByAccessToken(clientId, accessToken, owner, filePath, content)

  if (!updateFileResult) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_file_update_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: null, response: { result: { updateFileResult } }, redirect: null,
  }
}

/* GET /api/$apiVersion/file/content */
const handleFileContent = (clientId, accessToken, owner, filePath, getFileContentByAccessToken) => {
  const fileContent = getFileContentByAccessToken(clientId, accessToken, owner, filePath)

  if (!fileContent) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_file_content_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: null, response: { result: { fileContent } }, redirect: null,
  }
}

/* POST /api/$apiVersion/file/delete */
const handleFileDelete = (clientId, accessToken, owner, filePath, deleteFileByAccessToken) => {
  const deleteFileResult = deleteFileByAccessToken(clientId, accessToken, owner, filePath)

  if (!deleteFileResult) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_file_delete_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: null, response: { result: { deleteFileResult } }, redirect: null,
  }
}



/* GET /logout */
const handleLogout = () => {
  const status = mod.setting.bsc.statusList.OK
  return {
    status, session: {}, response: null, redirect: '/',
  }
}


export default {
  init,
  handleConnect,
  handleCredentialCheck,
  handleConfirm,
  handleThrough,
  handleCode,
  handleUserInfo,
  handleNotification,
  handleNotificationAppend,
  handleNotificationOpen,
  handleUserAdd,
  handleScope,
  handleGlobalNotification,
  handleFileUpdate,
  handleFileContent,
  handleFileDelete,
  handleLogout,
}

