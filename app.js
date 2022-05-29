const statusList = require('./statusList.js')
const lib = require('./lib.js')

const CLIENT_LIST = {
  'foo': 'https://sample.reiwa.co/f/xlogin/callback'
}

const USER_LIST = {
  'user@example.com': {
    passHmac2: 'hmac(hmac(pass))',
    serviceUserIdList: {
      'foo': 123456,
    },
  }
}

/* server common constant */
const scc = {}
scc.oidc = {}
scc.oidc.XLOGIN_ISSUER = 'https://xlogin.jp'
scc.oidc.CODE_L = 64
scc.oidc.ACCESS_TOKEN_L = 64

scc.url = {}
scc.url.ERROR_PAGE = '/error'
scc.url.AFTER_CONNECT = '/login'
scc.url.AFTER_CHECK_CREDENTIAL = '/confirm'

scc.condition = {}
scc.condition.LOGIN = 'login'
scc.condition.CONFIRM = 'confirm'
scc.condition.CODE = 'code'
scc.condition.USER_INFO = 'user_info'

scc.session = {}
scc.session.SESSION_ID_VERIFIER_L = 64
scc.session.SESSION_ID = 'sid'
scc.session.SESSION_ID_VERIFIER = 'sidv'


/* GET /api/v0.2/auth/connect */
const handleConnect = (client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method) => {
  if (!CLIENT_LIST[client_id] || CLIENT_LIST[client_id] !== decodeURIComponent(redirect_uri)) {
    const status = statusList.INVALID_CLIENT
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE }
  }

  const { sessionId, sessionIdVerifier } = lib.generateSessionId(scc.session.SESSION_ID_VERIFIER_L)

  const condition = scc.condition.LOGIN
  const newUserSession = { oidc: { condition, state, scope, response_type, code_challenge, code_challenge_method, redirect_uri } }

  const status = statusList.OK
  const redirectTo = `${scc.url.AFTER_CONNECT}/${sessionId}`
  return { status, cookie: [[scc.session.SESSION_ID, sessionId, {}], [scc.session.SESSION_ID_VERIFIER, sessionIdVerifier, {}]], sessionId, session: newUserSession, response: null, redirect: redirectTo }
}

/* POST /f/$condition/credential/check */
const handleCredentialCheck = (condition, emailAddress, passHmac2, sessionId, userSession) => {
  if (!sessionId || !userSession || !userSession.oidc || userSession.oidc['condition'] !== condition) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE }
  }
 
  if (!USER_LIST[emailAddress] || USER_LIST[emailAddress].passHmac2 !== passHmac2) {
    const status = statusList.INVALID_CREDENTIAL
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE }
  }

  const user = USER_LIST[emailAddress]
 
  const { sessionId: newSessionId, sessionIdVerifier: newSessionIdVerifier } = lib.generateSessionId(scc.session.SESSION_ID_VERIFIER_L)
  const newUserSession = Object.assign(userSession, { oidc: Object.assign({ condition: scc.condition.CONFIRM }, userSession.oidc) }, { user })
  const redirectTo = `${scc.url.AFTER_CHECK_CREDENTIAL}/${sessionId}`
  
  const status = statusList.OK
  return { status, cookie: [[scc.session.SESSION_ID, newSessionId, {}], [scc.session.SESSION_ID_VERIFIER, newSessionIdVerifier, {}]], sessionId: newSessionId, session: newUserSession, response: null, redirect: redirectTo }
}

/* POST /f/confirm/permission/check */
const handleConfirm = (permission_list, sessionId, userSession) => {
  if (!sessionId || !userSession || !userSession.oidc || userSession.oidc['condition'] !== scc.condition.CONFIRM) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE }
  }

  const code = lib.getRandomStr(scc.oidc.CODE_L)

  const iss = scc.oidc.XLOGIN_ISSUER
  const { redirect_uri, state } = userSession.oidc
  const redirectTo = lib.addQueryStr(decodeURIComponent(redirect_uri), lib.objToQuery({ state, code, iss }))

  const { sessionId: newSessionId, sessionIdVerifier: newSessionIdVerifier } = lib.generateSessionId(scc.session.SESSION_ID_VERIFIER_L)
  const newUserSession = Object.assign(userSession, { oidc: Object.assign({ condition: scc.condition.CODE, code, permission_list }, userSession.oidc) })

  const status = statusList.OK
  return { status, cookie: [[scc.session.SESSION_ID, newSessionId, {}], [scc.session.SESSION_ID_VERIFIER, newSessionIdVerifier, {}]], sessionId: newSessionId, session: newUserSession, response: null, redirect: redirectTo }
}

/* GET /api/v0.2/auth/code */
const handleCode = (client_id, state, code, code_verifier, sessionIdByCode, userSessionByCode, actionRegisterAccessToken) => {
  const generatedCodeChallenge = lib.convertToCodeChallenge(code_verifier, userSessionByCode.oidc['code_challenge_method'])
  if (userSessionByCode.oidc['code_challenge'] !== generatedCodeChallenge) {
    const status = statusList.INVALID_CODE_VERIFIER
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE }
  }

  const access_token = lib.getRandomStr(scc.oidc.ACCESS_TOKEN_L)

  const { sessionId: newSessionId, sessionIdVerifier: newSessionIdVerifier } = lib.generateSessionId(scc.session.SESSION_ID_VERIFIER_L)
  const newUserSession = Object.assign(userSessionByCode, { oidc: Object.assign({ condition: scc.condition.USER_INFO }, userSessionByCode.oidc) })

  const resultRegisterAccessToken = actionRegisterAccessToken(client_id, access_token, userSessionByCode.user)
  if (!resultRegisterAccessToken) {
    const status = statusList.SERVER_ERROR
    return { status, session: {}, response: { error: status } }
  }

  const status = statusList.OK
  return { status, cookie: null, sessionId: newSessionId, session: newUserSession, response: { result: { access_token } }, redirect: null }
}

/* GET /api/v0.2/user/info */
const handleUserInfo = (client_id, access_token, actionGetUserByAccessToken) => {
  const user_info = actionGetUserByAccessToken(client_id, access_token)

  if (!user_info) {
    const status = statusList.SERVER_ERROR
    return { status, session: {}, response: { error: status } }
  }

  const status = statusList.OK
  return { status, cookie: null, sessionId: null, session: null, response: { result: { user_info } }, redirect: null }
}


const main = () => {
  console.log('==================================================')
  const CLIENT_ID = 'foo'
  const XLOGIN_REDIRECT_URI = encodeURIComponent('https://sample.reiwa.co/f/xlogin/callback')

  const resultHandleConnect = handleConnect(CLIENT_ID, XLOGIN_REDIRECT_URI)
  console.log(resultHandleConnect)
  console.log('==================================================')

  const resultHandleCredentialCheck = handleCredentialCheck('login', 'user@example.com', 'hmac(hmac(pass))', 'sessionId', { oidc: { condition: 'login' }})
  console.log(resultHandleCredentialCheck)
  console.log('==================================================')

  const resultHandleConfirm = handleConfirm([], 'sessionId', { oidc: { condition: 'confirm', redirect_uri: XLOGIN_REDIRECT_URI, state: 'state' } })
  console.log(resultHandleConfirm)
  console.log('==================================================')

  const actionRegisterAccessToken = (client_id, access_token, user) => { return true }
  const resultHandleCode = handleCode(CLIENT_ID, 'state', 'code', 'code_verifier', 'sessionIdByCode', { oidc: { code_challenge: 'Base64(S256(code_verifier))', code_challenge_method: 'S256' } }, actionRegisterAccessToken)
  console.log(resultHandleCode)
  console.log('==================================================')

  const actionGetUserByAccessToken = (client_id, access_token) => { return { public: { serviceUserId: 123456 } } }
  const resultHandleUserInfo = handleUserInfo(CLIENT_LIST, 'access_token', actionGetUserByAccessToken)
  console.log(resultHandleUserInfo)
  console.log('==================================================')
}

main()

