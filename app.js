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
    passPbkdf2: 'ca134addc89453fd281e2854236e8d65cf3bdc94b57aa451977a316319586c476fc70c12e124c16dde13675d1ad493e24351958076815440b0f0cff16231b38a',
    saltHex: 'e04a00bb39f9d733ca02cafce730b887d66262a749ea7f237f30d0e4194927868c687339c56b0ed9ccf141ae1079086fa64a4d836e620c6d5490cfaecd0192c5',
    serviceVariable: {
      'foo': {
        service_user_id: '123456',
      },
      'sample_xlogin_jp': {
        service_user_id: 'abcdef',
      },
    },
  }
}
const ACCESS_TOKEN_LIST = {}

const AUTH_SESSION_LIST = {}

const coreRegisterAccessToken = (client_id, access_token, user, permission_list) => {
  ACCESS_TOKEN_LIST[access_token] = { client_id, user, permission_list }
  return true
}

const coreGetUserByAccessToken = (client_id, access_token, filter_key_list) => {
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

const coreCredentialCheck = async (emailAddress, passHmac2) => {
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

const coreAddUser = (client_id, emailAddress, passPbkdf2, saltHex) => {
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

/* http */
const coreGetErrorResponse = (status, error, isServerRedirect, response = null, session = {}) => {
  const redirect = `${scc.url.ERROR_PAGE}?error=${encodeURIComponent(error)}`
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


/* GET /api/$apiVersion/auth/connect */
const actionHandleConnect = (user, client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method) => {
  if (!CLIENT_LIST[client_id] || CLIENT_LIST[client_id] !== decodeURIComponent(redirect_uri)) {
    const status = statusList.INVALID_CLIENT
    const error = 'handle_connect_client'
    return coreGetErrorResponse(status, error, true)
  }
 
  if (user) {
    const condition = scc.condition.CONFIRM
    const newUserSession = { oidc: { client_id, condition, state, scope, response_type, code_challenge, code_challenge_method, redirect_uri }, user }
    const redirect = scc.url.AFTER_CHECK_CREDENTIAL

    const status = statusList.OK
    return { status, session: newUserSession, response: null, redirect }
  } else {
    const condition = scc.condition.LOGIN
    const newUserSession = { oidc: { client_id, condition, state, scope, response_type, code_challenge, code_challenge_method, redirect_uri } }

    const status = statusList.OK
    const redirect = scc.url.AFTER_CONNECT
    return { status, session: newUserSession, response: null, redirect }
  }
}

/* POST /f/$condition/credential/check */
const actionHandleCredentialCheck = async (emailAddress, passHmac2, authSession, coreCredentialCheck) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_credential_session'
    return coreGetErrorResponse(status, error, false)
  }

  const resultCredentialCheck = await coreCredentialCheck(emailAddress, passHmac2)
  if (resultCredentialCheck.credentialCheckResult !== true) {
    const status = statusList.INVALID_CREDENTIAL
    const error = 'handle_credential_credential'
    return coreGetErrorResponse(status, error, false, null, authSession)
  }

  const user = USER_LIST[emailAddress]
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CONFIRM }) }, { user })
  const redirect = scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* POST /f/confirm/permission/check */
const actionHandleConfirm = (permission_list, authSession) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CONFIRM) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_confirm_session'
    return coreGetErrorResponse(status, error, false)
  }

  const code = lib.getRandomB64UrlSafe(scc.oidc.CODE_L)

  const iss = scc.oidc.XLOGIN_ISSUER
  const { redirect_uri, state } = authSession.oidc
  const redirect = lib.addQueryStr(decodeURIComponent(redirect_uri), lib.objToQuery({ state, code, iss }))

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CODE, code, permission_list }) })

  AUTH_SESSION_LIST[code] = newUserSession

  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* GET /api/$apiVersion/auth/code */
const actionHandleCode = (client_id, state, code, code_verifier, authSession, coreRegisterAccessToken) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CODE) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_code_session'
    return coreGetErrorResponse(status, error, true)
  }

  if (client_id !== authSession.oidc.client_id) {
    const status = statusList.INVALID_CLIENT
    const error = 'handle_code_client'
    return coreGetErrorResponse(status, error, true)
  }

  const generatedCodeChallenge = lib.convertToCodeChallenge(code_verifier, authSession.oidc['code_challenge_method'])
  if (authSession.oidc['code_challenge'] !== generatedCodeChallenge) {
    const status = statusList.INVALID_CODE_VERIFIER
    const error = 'handle_code_challenge'
    return coreGetErrorResponse(status, error, true)
  }

  const access_token = lib.getRandomB64UrlSafe(scc.oidc.ACCESS_TOKEN_L)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.USER_INFO }) })

  const resultRegisterAccessToken = coreRegisterAccessToken(client_id, access_token, authSession.user, authSession.oidc.permission_list)
  if (!resultRegisterAccessToken) {
    const status = statusList.SERVER_ERROR
    const error = 'handle_code_access_token'
    return coreGetErrorResponse(status, error, null)
  }

  const status = statusList.OK
  return { status, session: newUserSession, response: { result: { access_token } }, redirect: null }
}

/* GET /api/$apiVersion/user/info */
const handleUserInfo = (client_id, access_token, filter_key_list_str, coreGetUserByAccessToken) => {
  const filter_key_list = filter_key_list_str.split(',')
  const user_info = coreGetUserByAccessToken(client_id, access_token, filter_key_list)

  if (!user_info) {
    const status = statusList.SERVER_ERROR
    const error = 'handle_user_info_access_token'
    return coreGetErrorResponse(status, error, null)
  }

  const status = statusList.OK
  return { status, session: null, response: { result: { user_info } }, redirect: null }
}

/* POST /f/login/user/add */
const actionHandleUserAdd = (emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, authSession, coreAddUser) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_user_add_session'
    return coreGetErrorResponse(status, error, false)
  }

  if (isTosChecked !== true || isPrivacyPolicyChecked !== true) {
    const status = statusList.INVALID_CHECK
    const error = 'handle_user_add_checkbox'
    return coreGetErrorResponse(status, error, false, null, authSession)
  }

  const client_id = authSession.oidc.client_id
  const resultAddUser = coreAddUser(client_id, emailAddress, passPbkdf2, saltHex)
 
  if (resultAddUser.registerResult !== true) {
    const status = statusList.REGISTER_FAIL
    const error = 'handle_user_add_register'
    return coreGetErrorResponse(status, error, false, null, authSession)
  }

  const user = USER_LIST[emailAddress]
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CONFIRM }) }, { user })
  const redirect = scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* GET /f/confirm/scope/list */
const actionHandleScope = (authSession) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_permission_list_session'
    return coreGetErrorResponse(status, error, false)
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
    return res.redirect(true)
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

  expressApp.get(`/api/${scc.url.API_VERSION}/auth/connect`, (req, res) => {
    const user = req.session.auth?.user
    const { client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method } = req.query
    const resultHandleConnect = actionHandleConnect(user, client_id, redirect_uri, state, scope, response_type, code_challenge, code_challenge_method)
    output(req, res, resultHandleConnect)
  })
  expressApp.post('/f/login/credential/check', async (req, res) => {
    const { emailAddress, passHmac2 } = req.body
    const resultHandleCredentialCheck = await actionHandleCredentialCheck(emailAddress, passHmac2, req.session.auth, coreCredentialCheck)
    output(req, res, resultHandleCredentialCheck)
  })
  expressApp.post('/f/confirm/permission/check', (req, res) => {
    const { permission_list } = req.body
    const resultHandleConfirm = actionHandleConfirm(permission_list, req.session.auth)
    output(req, res, resultHandleConfirm)
  })
  expressApp.get(`/api/${scc.url.API_VERSION}/auth/code`, (req, res) => {
    const { client_id, state, code, code_verifier } = req.query
    const authSession = AUTH_SESSION_LIST[code]
    const resultHandleCode = actionHandleCode(client_id, state, code, code_verifier, authSession, coreRegisterAccessToken)
    output(req, res, resultHandleCode)
  })
  expressApp.get(`/api/${scc.url.API_VERSION}/user/info`, (req, res) => {
    const access_token = req.headers['authorization'].slice('Bearer '.length)
    const client_id = req.headers['x-xlogin-client-id']
    const { filter_key_list_str } = req.query

    const resultHandleUserInfo = handleUserInfo(client_id, access_token, filter_key_list_str, coreGetUserByAccessToken)
    output(req, res, resultHandleUserInfo)
  })
  expressApp.post('/f/login/user/add', (req, res) => {
    const { emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked } = req.body
    const resultHandleUserAdd = actionHandleUserAdd(emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, req.session.auth, coreAddUser)
    output(req, res, resultHandleUserAdd)
  })
  expressApp.get('/f/confirm/scope/read', (req, res) => {
    const resultHandleScope = actionHandleScope(req.session.auth)
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

  console.log(`open: http://${process.env.SERVER_ORIGIN}/`)
}

main()

