/* /action.js */
const mod = {}

const init = (statusList, scc, lib) => {
  mod.statusList = statusList
  mod.scc = scc
  mod.lib = lib
}


/* GET /api/$apiVersion/auth/connect */
const handleConnect = (user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, getErrorResponse, isValidClient) => {
  if (!isValidClient(clientId, redirectUri)) {
    const status = mod.statusList.INVALID_CLIENT
    const error = 'handle_connect_client'
    return getErrorResponse(status, error, true)
  }
 
  if (user) {
    const condition = mod.scc.condition.CONFIRM
    const newUserSession = { oidc: { clientId, condition, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri }, user }
    const redirect = mod.scc.url.AFTER_CHECK_CREDENTIAL

    const status = mod.statusList.OK
    return { status, session: newUserSession, response: null, redirect }
  } else {
    const condition = mod.scc.condition.LOGIN
    const newUserSession = { oidc: { clientId, condition, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri } }

    const status = mod.statusList.OK
    const redirect = mod.scc.url.AFTER_CONNECT
    return { status, session: newUserSession, response: null, redirect }
  }
}

/* POST /f/$condition/credential/check */
const handleCredentialCheck = async (emailAddress, passHmac2, authSession, credentialCheck, getErrorResponse, getUserByEmailAddress) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.statusList.INVALID_SESSION
    const error = 'handle_credential_session'
    return getErrorResponse(status, error, false)
  }

  const resultCredentialCheck = await credentialCheck(emailAddress, passHmac2)
  if (resultCredentialCheck.credentialCheckResult !== true) {
    const status = mod.statusList.INVALID_CREDENTIAL
    const error = 'handle_credential_credential'
    return getErrorResponse(status, error, false, null, authSession)
  }

  const user = getUserByEmailAddress(emailAddress)
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.scc.condition.CONFIRM }) }, { user })
  const redirect = mod.scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = mod.statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* POST /f/confirm/permission/check */
const handleConfirm = (permissionList, authSession, getErrorResponse, registerAuthSession) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== mod.scc.condition.CONFIRM) {
    const status = mod.statusList.INVALID_SESSION
    const error = 'handle_confirm_session'
    return getErrorResponse(status, error, false)
  }

  const code = mod.lib.getRandomB64UrlSafe(mod.scc.oidc.CODE_L)

  const iss = process.env.SERVER_ORIGIN
  const { redirectUri, state } = authSession.oidc
  const redirect = mod.lib.addQueryStr(decodeURIComponent(redirectUri), mod.lib.objToQuery({ state, code, iss }))

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.scc.condition.CODE, code, permissionList }) })

  registerAuthSession(code, newUserSession)

  const status = mod.statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* GET /api/$apiVersion/auth/code */
const handleCode = (clientId, state, code, codeVerifier, registerAccessToken, getErrorResponse, getAuthSessionByCode) => {
  const authSession = getAuthSessionByCode(code)
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== mod.scc.condition.CODE) {
    const status = mod.statusList.INVALID_SESSION
    const error = 'handle_code_session'
    return getErrorResponse(status, error, true)
  }

  if (clientId !== authSession.oidc.clientId) {
    const status = mod.statusList.INVALID_CLIENT
    const error = 'handle_code_client'
    return getErrorResponse(status, error, true)
  }

  const generatedCodeChallenge = mod.lib.convertToCodeChallenge(codeVerifier, authSession.oidc.codeChallengeMethod)
  if (authSession.oidc.codeChallenge !== generatedCodeChallenge) {
    const status = mod.statusList.INVALID_CODE_VERIFIER
    const error = 'handle_code_challenge'
    return getErrorResponse(status, error, true)
  }

  const accessToken = mod.lib.getRandomB64UrlSafe(mod.scc.oidc.ACCESS_TOKEN_L)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.scc.condition.USER_INFO }) })

  const resultRegisterAccessToken = registerAccessToken(clientId, accessToken, authSession.user, authSession.oidc.permissionList)
  if (!resultRegisterAccessToken) {
    const status = mod.statusList.SERVER_ERROR
    const error = 'handle_code_access_token'
    return getErrorResponse(status, error, null)
  }

  const status = mod.statusList.OK
  return { status, session: newUserSession, response: { result: { accessToken } }, redirect: null }
}

/* GET /api/$apiVersion/user/info */
const handleUserInfo = (clientId, accessToken, filterKeyListStr, getUserByAccessToken, getErrorResponse) => {
  const filterKeyList = filterKeyListStr.split(',')
  const userInfo = getUserByAccessToken(clientId, accessToken, filterKeyList)

  if (!userInfo) {
    const status = mod.statusList.SERVER_ERROR
    const error = 'handle_user_info_access_token'
    return getErrorResponse(status, error, null)
  }

  const status = mod.statusList.OK
  return { status, session: null, response: { result: { userInfo } }, redirect: null }
}

/* POST /f/login/user/add */
const handleUserAdd = (emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, authSession, addUser, getErrorResponse, getUserByEmailAddress) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.statusList.INVALID_SESSION
    const error = 'handle_user_add_session'
    return getErrorResponse(status, error, false)
  }

  if (isTosChecked !== true || isPrivacyPolicyChecked !== true) {
    const status = mod.statusList.INVALID_CHECK
    const error = 'handle_user_add_checkbox'
    return getErrorResponse(status, error, false, null, authSession)
  }

  const clientId = authSession.oidc.clientId
  const resultAddUser = addUser(clientId, emailAddress, passPbkdf2, saltHex)
 
  if (resultAddUser.registerResult !== true) {
    const status = mod.statusList.REGISTER_FAIL
    const error = 'handle_user_add_register'
    return getErrorResponse(status, error, false, null, authSession)
  }

  const user = getUserByEmailAddress(emailAddress)
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.scc.condition.CONFIRM }) }, { user })
  const redirect = mod.scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = mod.statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* GET /f/confirm/scope/list */
const handleScope = (authSession, getErrorResponse) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.statusList.INVALID_SESSION
    const error = 'handle_permission_list_session'
    return getErrorResponse(status, error, false)
  }

  const scope = authSession.oidc.scope
  const status = mod.statusList.OK

  return { status, session: authSession, response: { result: { scope } } }
}

/* GET /logout */
const handleLogout = (authSession) => {
  const status = mod.statusList.OK
  return { status, session: {}, response: null, redirect: '/' }
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

