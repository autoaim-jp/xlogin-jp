/* /action.js */
const mod = {}

const init = (setting, lib) => {
  mod.setting = setting
  mod.lib = lib
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
    const newUserSession = { oidc: { clientId, condition, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri }, user }
    const redirect = mod.setting.url.AFTER_CHECK_CREDENTIAL

    const status = mod.setting.bsc.statusList.OK
    return { status, session: newUserSession, response: null, redirect }
  } else {
    const condition = mod.setting.condition.LOGIN
    const newUserSession = { oidc: { clientId, condition, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri } }

    const status = mod.setting.bsc.statusList.OK
    const redirect = mod.setting.url.AFTER_CONNECT
    return { status, session: newUserSession, response: null, redirect }
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

/* POST /f/confirm/permission/check */
const handleConfirm = (permissionList, authSession, registerAuthSession) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== mod.setting.condition.CONFIRM) {
    const status = mod.setting.bsc.statusList.INVALID_SESSION
    const error = 'handle_confirm_session'
    return _getErrorResponse(status, error, false)
  }

  const code = mod.lib.getRandomB64UrlSafe(mod.setting.oidc.CODE_L)

  const iss = process.env.SERVER_ORIGIN
  const { redirectUri, state } = authSession.oidc
  const redirect = mod.lib.addQueryStr(decodeURIComponent(redirectUri), mod.lib.objToQuery({ state, code, iss }))

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.condition.CODE, code, permissionList }) })

  registerAuthSession(code, newUserSession)

  const status = mod.setting.bsc.statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* GET /api/$apiVersion/auth/code */
const handleCode = (clientId, state, code, codeVerifier, registerAccessToken, getAuthSessionByCode) => {
  const authSession = getAuthSessionByCode(code)
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== mod.setting.condition.CODE) {
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

  const resultRegisterAccessToken = registerAccessToken(clientId, accessToken, authSession.user, authSession.oidc.permissionList)
  if (!resultRegisterAccessToken) {
    const status = mod.setting.bsc.statusList.SERVER_ERROR
    const error = 'handle_code_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.bsc.statusList.OK
  return { status, session: newUserSession, response: { result: { accessToken } }, redirect: null }
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
  return { status, session: null, response: { result: { userInfo } }, redirect: null }
}

/* POST /f/login/user/add */
const handleUserAdd = (emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, authSession, addUser, getUserByEmailAddress, registerUserByEmailAddress) => {
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

  const clientId = authSession.oidc.clientId
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

  const scope = authSession.oidc.scope
  const status = mod.setting.bsc.statusList.OK

  return { status, session: authSession, response: { result: { scope } } }
}

/* GET /logout */
const handleLogout = (authSession) => {
  const status = mod.setting.bsc.statusList.OK
  return { status, session: {}, response: null, redirect: '/' }
}


/* http */
const _getErrorResponse = (status, error, isServerRedirect, response = null, session = {}) => {
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
  handleConnect,
  handleCredentialCheck,
  handleConfirm,
  handleCode,
  handleUserInfo,
  handleUserAdd,
  handleScope,
  handleLogout,
}

