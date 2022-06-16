const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const Redis = require('ioredis')
const RedisStore = require('connect-redis')(session)
require('dotenv').config()
process.env.APP_PATH = `${__dirname}/`

const statusList = require('./statusList.js')
const lib = require('./lib.js')
const scc = require('./serverCommonConstant.js')

const CLIENT_LIST = {
  'foo': 'http://localhost:3001/f/xlogin/callback'
}

const USER_LIST = {
  'user@example.com': {
    passHmac2: 'hmac(hmac(pass))',
    serviceUserIdList: {
      'foo': 123456,
    },
  }
}
const ACCESS_TOKEN_LIST = {}

const actionRegisterAccessToken = (client_id, access_token, user) => {
  ACCESS_TOKEN_LIST[access_token] = { client_id, user }
  return true
}

const actionGetUserByAccessToken = (client_id, access_token) => {
  if (ACCESS_TOKEN_LIST[access_token] && ACCESS_TOKEN_LIST[access_token].client_id === client_id) {
    const user = ACCESS_TOKEN_LIST[access_token].user
    const serviceUserId = user.serviceUserIdList[client_id]
    return { public: { serviceUserId } }
  }

  return null
}

/* GET /api/v0.2/auth/connect */
const handleConnect = (client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method) => {
  if (!CLIENT_LIST[client_id] || CLIENT_LIST[client_id] !== decodeURIComponent(redirect_uri)) {
    const status = statusList.INVALID_CLIENT
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_connect_client' }
  }

  const condition = scc.condition.LOGIN
  const newUserSession = { oidc: { condition, state, scope, response_type, code_challenge, code_challenge_method, redirect_uri } }

  const status = statusList.OK
  const redirectTo = scc.url.AFTER_CONNECT
  return { status, session: newUserSession, response: null, redirect: redirectTo }
}

/* POST /f/$condition/credential/check */
const handleCredentialCheck = (condition, emailAddress, passHmac2, authSession) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== condition) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_credential_session' }
  }
 
  if (!USER_LIST[emailAddress] || USER_LIST[emailAddress].passHmac2 !== passHmac2) {
    const status = statusList.INVALID_CREDENTIAL
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_credential_credential' }
  }

  const user = USER_LIST[emailAddress]
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CONFIRM }) }, { user })
  const redirectTo = scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = statusList.OK
  return { status, session: newUserSession, response: null, redirect: redirectTo }
}

/* POST /f/confirm/permission/check */
const handleConfirm = (permission_list, authSession) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CONFIRM) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_confirm_session' }
  }

  const code = lib.getRandomStr(scc.oidc.CODE_L)

  const iss = scc.oidc.XLOGIN_ISSUER
  const { redirect_uri, state } = authSession.oidc
  const redirectTo = lib.addQueryStr(decodeURIComponent(redirect_uri), lib.objToQuery({ state, code, iss }))

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CODE, code, permission_list }) })

  const status = statusList.OK
  return { status, session: newUserSession, response: null, redirect: redirectTo }
}

/* GET /api/v0.2/auth/code */
const handleCode = (client_id, state, code, code_verifier, authSession, actionRegisterAccessToken) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CODE) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_code_session' }
  }

  const generatedCodeChallenge = lib.convertToCodeChallenge(code_verifier, authSession.oidc['code_challenge_method'])
  if (authSession.oidc['code_challenge'] !== generatedCodeChallenge) {
    const status = statusList.INVALID_CODE_VERIFIER
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_code_challenge' }
  }

  const access_token = lib.getRandomStr(scc.oidc.ACCESS_TOKEN_L)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.USER_INFO }) })

  const resultRegisterAccessToken = actionRegisterAccessToken(client_id, access_token, authSession.user)
  if (!resultRegisterAccessToken) {
    const status = statusList.SERVER_ERROR
    return { status, session: {}, response: { error: status }, error: 'handle_code_access_token' }
  }

  const status = statusList.OK
  return { status, session: newUserSession, response: { result: { access_token } }, redirect: null }
}

/* GET /api/v0.2/user/info */
const handleUserInfo = (client_id, access_token, actionGetUserByAccessToken) => {
  const user_info = actionGetUserByAccessToken(client_id, access_token)

  if (!user_info) {
    const status = statusList.SERVER_ERROR
    return { status, session: {}, response: { error: status }, error: 'handle_user_info_access_token' }
  }

  const status = statusList.OK
  return { status, session: null, response: { result: { user_info } }, redirect: null }
}


const output = (req, res, handleResult) => {
  console.log('output error:', handleResult.error)
  req.session.auth = handleResult.session

  if (handleResult.response) {
    return res.json(handleResult.response)
  } else if (handleResult.redirect) {
    return res.redirect(handleResult.redirect)
  } else {
    return res.redirect(scc.url.ERROR_PAGE)
  }
}

const main = () => {
  const expressApp = express()

  const redis = new Redis({
    port: scc.session.REDIS_PORT,
    host: scc.session.REDIS_HOST,
    db: scc.session.REDIS_DB,
  })
  expressApp.use(session({
    secret : process.env.SESSION_SECRET, 
    resave : true,
    saveUninitialized : true,                
    rolling : true,
    name : scc.session.SESSION_ID,
    cookie: {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: scc.session.SESSION_COOKIE_SECURE,
      httpOnly: true,
      sameSite: 'lax',
    },
    store: new RedisStore({ client: redis }),
  }))

  expressApp.use(bodyParser.urlencoded({ extended: true }))
  expressApp.use(bodyParser.json())

  expressApp.get('/api/v0.2/auth/connect', (req, res) => {
    const { client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method } = req.query
    const resultHandleConnect = handleConnect(client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method)
    output(req, res, resultHandleConnect)
  })
  expressApp.post('/f/:condition/credential/check', (req, res) => {
    const condition = req.params.condition
    const { emailAddress, passHmac2 } = req.body
    const resultHandleCredentialCheck = handleCredentialCheck(condition, emailAddress, passHmac2, req.session.auth)
    output(req, res, resultHandleCredentialCheck)
  })
  expressApp.post('/f/confirm/permission/check', (req, res) => {
    const { permission_list } = req.body
    const resultHandleConfirm = handleConfirm(permission_list, req.session.auth)
    output(req, res, resultHandleConfirm)
  })
  expressApp.get('/api/v0.2/auth/code', (req, res) => {
    const { client_id, state, code, code_verifier } = req.query

    const resultHandleCode = handleCode(client_id, state, code, code_verifier, req.session.auth, actionRegisterAccessToken)
    output(req, res, resultHandleCode)
  })
  expressApp.get('/api/v0.2/user/info', (req, res) => {
    const access_token = req.headers['authorization'].slice('Bearer '.length)
    const client_id = req.headers['x_xlogin_client_id']

    const resultHandleUserInfo = handleUserInfo(client_id, access_token, actionGetUserByAccessToken)
    output(req, res, resultHandleUserInfo)
  })

  expressApp.use(express.static(scc.server.PUBLIC_DIR, { index: 'index.html', extensions: ['html'] }))

  expressApp.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)
    res.end('Internal Server Error')
  })
  expressApp.listen(scc.server.PORT, () => {
    console.log(`Example app listening at http://127.0.0.1:${scc.server.PORT}`)
  })

  console.log('open: http://127.0.0.1:3000/api/v0.2/auth/connect?client_id=foo&redirect_uri=https%3A%2F%2Fsample.reiwa.co%2Ff%2Fxlogin%2Fcallback&state=abcde&code_challenge=Base64(S256(code_verifier))&code_challenge_method=S256&scope=r_user&response_type=code')
}

main()

