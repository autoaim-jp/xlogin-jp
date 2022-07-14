const fs = require('fs')
const https = require('https')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const Redis = require('ioredis')
const RedisStore = require('connect-redis')(session)
require('dotenv').config()
process.env.APP_PATH = `${__dirname}/`

const statusList = require('./statusList.js')
const lib = require('./lib.js')
const scc = require('./serverCommonConstant.js')

const CLIENT_LIST = {
  'foo': 'http://localhost:3001/f/xlogin/callback',
  'sample_xlogin_jp': 'https://sample.xlogin.jp/f/xlogin/callback'
}

const USER_LIST = {
  'user@example.com': {
    email_address: 'user@example.com',
    user_name: 'sample user',
    passPbkdf2: '6122da598537a295d4f6ae92562706bd7874a642e5f47c97aeae5a7752b5502f05b818c690993a16aa2d586103bfd7b98f0a74aa4809ec581426f69ee792f4e9',
    saltHex: 'b244ca79bdf040595ccfa425f8b1c61703b3eb1cae0e0a28abd89683e4c8fb1adf5ef9cd45de530f5537fe36ca3d707e3610f70c4ba967e79dad4db54517467a',
    serviceVariable: {
      'foo': {
        service_user_id: 123456,
      },
    },
  }
}
const ACCESS_TOKEN_LIST = {}

const AUTH_SESSION_LIST = {}

const actionRegisterAccessToken = (client_id, access_token, user, permission_list) => {
  ACCESS_TOKEN_LIST[access_token] = { client_id, user, permission_list }
  return true
}

const actionGetUserByAccessToken = (client_id, access_token, filter_key_list) => {
  if (ACCESS_TOKEN_LIST[access_token] && ACCESS_TOKEN_LIST[access_token].client_id === client_id) {
    const { user, permission_list } = ACCESS_TOKEN_LIST[access_token]
    const publicData = {}
    filter_key_list.forEach((key) => {
      const permission = `r:${key}`
      console.log(permission, permission_list[permission])
      if (permission_list[permission]) {
        publicData[key] = user[key] || user.serviceVariable[client_id][key]
      }
    })
    console.log({ publicData, user })
    return { public: publicData }
  }

  return null
}

const actionCredentialCheck = async (emailAddress, passHmac2) => {
  if (!USER_LIST[emailAddress]) {
    return { credentialCheckResult: false }
  }

  const saltHex = USER_LIST[emailAddress].saltHex

  const passPbkdf2 = await lib.calcPbkdf2(passHmac2, saltHex)
  if(USER_LIST[emailAddress].passPbkdf2 !== passPbkdf2) {
    return { credentialCheckResult: false }
  }

  return { credentialCheckResult: true }
}

const actionAddUser = (client_id, emailAddress, passPbkdf2, saltHex) => {
  if (USER_LIST[emailAddress]) {
    return { registerResult: false }
  }

  const user = {
    passPbkdf2,
    saltHex,
    serviceVariable: {}
  }

  if (client_id) {
    const service_user_id = lib.getRandomB64UrlSafe(scc.user.SERVICE_USER_ID_L)
    user.serviceVariable[client_id] = { service_user_id }
  }

  USER_LIST[emailAddress] = user

  return { registerResult: true }
}

/* GET /api/v0.2/auth/connect */
const handleConnect = (user, client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method) => {
  if (!CLIENT_LIST[client_id] || CLIENT_LIST[client_id] !== decodeURIComponent(redirect_uri)) {
    const status = statusList.INVALID_CLIENT
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_connect_client' }
  }
 
  if (user) {
    const condition = scc.condition.CONFIRM
    const newUserSession = { oidc: { client_id, condition, state, scope, response_type, code_challenge, code_challenge_method, redirect_uri }, user }
    const redirectTo = scc.url.AFTER_CHECK_CREDENTIAL

    const status = statusList.OK
    return { status, session: newUserSession, response: null, redirect: redirectTo }
  } else {
    const condition = scc.condition.LOGIN
    const newUserSession = { oidc: { client_id, condition, state, scope, response_type, code_challenge, code_challenge_method, redirect_uri } }

    const status = statusList.OK
    const redirectTo = scc.url.AFTER_CONNECT
    return { status, session: newUserSession, response: null, redirect: redirectTo }
  }
}

/* POST /f/$condition/credential/check */
const handleCredentialCheck = async (emailAddress, passHmac2, authSession, actionCredentialCheck) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_credential_session' }
  }

  const resultCredentialCheck = await actionCredentialCheck(emailAddress, passHmac2)
  if (resultCredentialCheck.credentialCheckResult !== true) {
    const status = statusList.INVALID_CREDENTIAL
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_credential_credential' }
  }

  const user = USER_LIST[emailAddress]
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CONFIRM }) }, { user })
  const redirectTo = scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect: redirectTo } }
}

/* POST /f/confirm/permission/check */
const handleConfirm = (permission_list, authSession) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CONFIRM) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_confirm_session' }
  }

  const code = lib.getRandomB64UrlSafe(scc.oidc.CODE_L)

  const iss = scc.oidc.XLOGIN_ISSUER
  const { redirect_uri, state } = authSession.oidc
  const redirectTo = lib.addQueryStr(decodeURIComponent(redirect_uri), lib.objToQuery({ state, code, iss }))

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CODE, code, permission_list }) })

  AUTH_SESSION_LIST[code] = newUserSession

  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect: redirectTo } }
}

/* GET /api/v0.2/auth/code */
const handleCode = (client_id, state, code, code_verifier, authSession, actionRegisterAccessToken) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CODE) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_code_session' }
  }

  if (client_id !== authSession.oidc.client_id) {
    const status = statusList.INVALID_CLIENT
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_code_client' }
  }

  const generatedCodeChallenge = lib.convertToCodeChallenge(code_verifier, authSession.oidc['code_challenge_method'])
  if (authSession.oidc['code_challenge'] !== generatedCodeChallenge) {
    const status = statusList.INVALID_CODE_VERIFIER
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_code_challenge' }
  }

  const access_token = lib.getRandomB64UrlSafe(scc.oidc.ACCESS_TOKEN_L)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.USER_INFO }) })

  const resultRegisterAccessToken = actionRegisterAccessToken(client_id, access_token, authSession.user, authSession.oidc.permission_list)
  if (!resultRegisterAccessToken) {
    const status = statusList.SERVER_ERROR
    return { status, session: {}, response: { error: status }, error: 'handle_code_access_token' }
  }

  const status = statusList.OK
  return { status, session: newUserSession, response: { result: { access_token } }, redirect: null }
}

/* GET /api/v0.2/user/info */
const handleUserInfo = (client_id, access_token, filter_key_list_str, actionGetUserByAccessToken) => {
  const filter_key_list = filter_key_list_str.split(',')
  const user_info = actionGetUserByAccessToken(client_id, access_token, filter_key_list)

  if (!user_info) {
    const status = statusList.SERVER_ERROR
    return { status, session: {}, response: { error: status }, error: 'handle_user_info_access_token' }
  }

  const status = statusList.OK
  return { status, session: null, response: { result: { user_info } }, redirect: null }
}

/* POST /f/login/user/add */
const handleUserAdd = (emailAddress, passPbkdf2, saltHex, tosChecked, privacyPolicyChecked, authSession, actionAddUser) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_user_add_session' }
  }

  if (tosChecked !== 'tosChecked' || privacyPolicyChecked !== 'privacyPolicyChecked') {
    const status = statusList.INVALID_CHECK
    return { status, session: {}, response: { error: status }, error: 'handle_user_add_checkbox' }
  }

  const client_id = authSession.oidc.client_id
  const resultAddUser = actionAddUser(client_id, emailAddress, passPbkdf2, saltHex)
 
  if (resultAddUser.registerResult !== true) {
    const status = statusList.REGISTER_FAIL
    return { status, session: {}, response: null, redirect: scc.url.ERROR_PAGE, error: 'handle_user_add_register' }
  }

  const user = USER_LIST[emailAddress]
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CONFIRM }) }, { user })
  const redirectTo = scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect: redirectTo } }
}

/* GET /f/confirm/scope/list */
const handleScope = (authSession) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    const redirectTo = scc.url.ERROR_PAGE
    return { status, session: {}, response: { redirect: redirectTo }, error: 'handle_permission_list_session' }
  }

  const scope = authSession.oidc.scope
  const status = statusList.OK

  return { status, session: authSession, response: { result: { scope } } }
}


const output = (req, res, handleResult) => {
  console.log('output error:', handleResult.error)
  req.session.auth = handleResult.session

  if (handleResult.response) {
    return res.json(handleResult.response)
  } else if (handleResult.redirect) {
    // if (req.method === 'GET') {
      return res.redirect(handleResult.redirect)
    /*
    } else {
      return res.json({ redirect: handleResult.redirect })
    }
    */
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
  expressApp.use(cookieParser())

  expressApp.get('/api/v0.2/auth/connect', (req, res) => {
    const user = req.session.auth?.user
    const { client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method } = req.query
    const resultHandleConnect = handleConnect(user, client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method)
    output(req, res, resultHandleConnect)
  })
  expressApp.post('/f/login/credential/check', async (req, res) => {
    const { emailAddress, passHmac2 } = req.body
    const resultHandleCredentialCheck = await handleCredentialCheck(emailAddress, passHmac2, req.session.auth, actionCredentialCheck)
    output(req, res, resultHandleCredentialCheck)
  })
  expressApp.post('/f/confirm/permission/check', (req, res) => {
    const { permission_list } = req.body
    const resultHandleConfirm = handleConfirm(permission_list, req.session.auth)
    output(req, res, resultHandleConfirm)
  })
  expressApp.get('/api/v0.2/auth/code', (req, res) => {
    const { client_id, state, code, code_verifier } = req.query
    const authSession = AUTH_SESSION_LIST[code]
    const resultHandleCode = handleCode(client_id, state, code, code_verifier, authSession, actionRegisterAccessToken)
    output(req, res, resultHandleCode)
  })
  expressApp.get('/api/v0.2/user/info', (req, res) => {
    const access_token = req.headers['authorization'].slice('Bearer '.length)
    const client_id = req.headers['x_xlogin_client_id']
    const { filter_key_list_str } = req.query

    const resultHandleUserInfo = handleUserInfo(client_id, access_token, filter_key_list_str, actionGetUserByAccessToken)
    output(req, res, resultHandleUserInfo)
  })
  expressApp.post('/f/login/user/add', (req, res) => {
    const { emailAddress, passPbkdf2, saltHex, tosChecked, privacyPolicyChecked } = req.body
    const resultHandleUserAdd = handleUserAdd(emailAddress, passPbkdf2, saltHex, tosChecked, privacyPolicyChecked, req.session.auth, actionUserAdd)
    output(req, res, resultHandleUserAdd)
  })
  expressApp.get('/f/confirm/scope/read', (req, res) => {
    const resultHandleScope = handleScope(req.session.auth)
    output(req, res, resultHandleScope)
  })

  expressApp.use(express.static(scc.server.PUBLIC_BUILD_DIR, { index: 'index.html', extensions: ['html'] }))
  expressApp.use(express.static(scc.server.PUBLIC_STATIC_DIR, { index: 'index.html', extensions: ['html'] }))

  expressApp.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)
    res.end('Internal Server Error')
  })

  if (process.env.SERVER_ORIGIN.indexOf('https') >= 0) {
    const tlsConfig = {
      key: fs.readFileSync(process.env.TLS_KEY_PATH),
      cert: fs.readFileSync(process.env.TLS_CERT_PATH),
    }
    const server = https.createServer(tlsConfig, expressApp)
    server.listen(process.env.SERVER_PORT, () => {
      console.log(`Example app listening at port: ${process.env.SERVER_PORT}, origin: ${process.env.SERVER_ORIGIN}`)
    })
  } else {
    expressApp.listen(process.env.SERVER_PORT, () => {
      console.log(`Example app listening at port: ${process.env.SERVER_PORT}, origin: ${process.env.SERVER_ORIGIN}`)
    })
  }

  console.log('open: http://127.0.0.1:3000/api/v0.2/auth/connect?client_id=foo&redirect_uri=https%3A%2F%2Fsample.reiwa.co%2Ff%2Fxlogin%2Fcallback&state=abcde&code_challenge=Base64(S256(code_verifier))&code_challenge_method=S256&scope=r_user&response_type=code')
}

main()

