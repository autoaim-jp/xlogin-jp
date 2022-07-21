import fs from 'fs'
import https from 'https'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import Redis from 'ioredis'
import RedisStore from 'connect-redis'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config()

process.env.APP_PATH = `${path.dirname(new URL(import.meta.url).pathname)}/`

import statusList from './statusList.js'
import lib from './lib.js'
import scc from './serverCommonConstant.js'

const CLIENT_LIST = {
  'foo': 'http://localhost:3001/f/xlogin/callback',
  'sample_xlogin_jp': 'https://sample.xlogin.jp/f/xlogin/callback'
}

const USER_LIST = {
  'user@example.com': {
    emailAddress: 'user@example.com',
    userName: 'sample user',
    passPbkdf2: 'ca134addc89453fd281e2854236e8d65cf3bdc94b57aa451977a316319586c476fc70c12e124c16dde13675d1ad493e24351958076815440b0f0cff16231b38a',
    saltHex: 'e04a00bb39f9d733ca02cafce730b887d66262a749ea7f237f30d0e4194927868c687339c56b0ed9ccf141ae1079086fa64a4d836e620c6d5490cfaecd0192c5',
    serviceVariable: {
      'foo': {
        serviceUserId: '123456',
      },
      'sample_xlogin_jp': {
        serviceUserId: 'abcdef',
      },
    },
  }
}
const ACCESS_TOKEN_LIST = {}

const AUTH_SESSION_LIST = {}

const coreRegisterAccessToken = (clientId, accessToken, user, permissionList) => {
  ACCESS_TOKEN_LIST[accessToken] = { clientId, user, permissionList }
  return true
}

const coreGetUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  if (ACCESS_TOKEN_LIST[accessToken] && ACCESS_TOKEN_LIST[accessToken].clientId === clientId) {
    const { user, permissionList } = ACCESS_TOKEN_LIST[accessToken]
    const publicData = {}
    filterKeyList.forEach((key) => {
      const permission = `r:${key}`
      if (permissionList[permission]) {
        publicData[key] = user[key] || user.serviceVariable[clientId][key]
      }
    })
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

const coreAddUser = (clientId, emailAddress, passPbkdf2, saltHex) => {
  if (USER_LIST[emailAddress]) {
    return { registerResult: false }
  }

  const user = {
    passPbkdf2,
    saltHex,
    userName: 'no name',
    serviceVariable: {}
  }

  if (clientId) {
    const serviceUserId = lib.getRandomB64UrlSafe(scc.user.SERVICE_USER_ID_L)
    user.serviceVariable[clientId] = { serviceUserId }
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
const actionHandleConnect = (user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod) => {
  if (!CLIENT_LIST[clientId] || CLIENT_LIST[clientId] !== decodeURIComponent(redirectUri)) {
    const status = statusList.INVALID_CLIENT
    const error = 'handle_connect_client'
    return coreGetErrorResponse(status, error, true)
  }
 
  if (user) {
    const condition = scc.condition.CONFIRM
    const newUserSession = { oidc: { clientId, condition, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri }, user }
    const redirect = scc.url.AFTER_CHECK_CREDENTIAL

    const status = statusList.OK
    return { status, session: newUserSession, response: null, redirect }
  } else {
    const condition = scc.condition.LOGIN
    const newUserSession = { oidc: { clientId, condition, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri } }

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
const actionHandleConfirm = (permissionList, authSession) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CONFIRM) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_confirm_session'
    return coreGetErrorResponse(status, error, false)
  }

  const code = lib.getRandomB64UrlSafe(scc.oidc.CODE_L)

  const iss = process.env.SERVER_ORIGIN
  const { redirectUri, state } = authSession.oidc
  const redirect = lib.addQueryStr(decodeURIComponent(redirectUri), lib.objToQuery({ state, code, iss }))

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CODE, code, permissionList }) })

  AUTH_SESSION_LIST[code] = newUserSession

  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* GET /api/$apiVersion/auth/code */
const actionHandleCode = (clientId, state, code, codeVerifier, authSession, coreRegisterAccessToken) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CODE) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_code_session'
    return coreGetErrorResponse(status, error, true)
  }

  if (clientId !== authSession.oidc.clientId) {
    const status = statusList.INVALID_CLIENT
    const error = 'handle_code_client'
    return coreGetErrorResponse(status, error, true)
  }

  const generatedCodeChallenge = lib.convertToCodeChallenge(codeVerifier, authSession.oidc.codeChallengeMethod)
  if (authSession.oidc.codeChallenge !== generatedCodeChallenge) {
    const status = statusList.INVALID_CODE_VERIFIER
    const error = 'handle_code_challenge'
    return coreGetErrorResponse(status, error, true)
  }

  const accessToken = lib.getRandomB64UrlSafe(scc.oidc.ACCESS_TOKEN_L)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.USER_INFO }) })

  const resultRegisterAccessToken = coreRegisterAccessToken(clientId, accessToken, authSession.user, authSession.oidc.permissionList)
  if (!resultRegisterAccessToken) {
    const status = statusList.SERVER_ERROR
    const error = 'handle_code_access_token'
    return coreGetErrorResponse(status, error, null)
  }

  const status = statusList.OK
  return { status, session: newUserSession, response: { result: { accessToken } }, redirect: null }
}

/* GET /api/$apiVersion/user/info */
const handleUserInfo = (clientId, accessToken, filterKeyListStr, coreGetUserByAccessToken) => {
  const filterKeyList = filterKeyListStr.split(',')
  const userInfo = coreGetUserByAccessToken(clientId, accessToken, filterKeyList)

  if (!userInfo) {
    const status = statusList.SERVER_ERROR
    const error = 'handle_user_info_access_token'
    return coreGetErrorResponse(status, error, null)
  }

  const status = statusList.OK
  return { status, session: null, response: { result: { userInfo } }, redirect: null }
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

  const clientId = authSession.oidc.clientId
  const resultAddUser = coreAddUser(clientId, emailAddress, passPbkdf2, saltHex)
 
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
    store: new (RedisStore(session))({ client: redis }),
  }))

  expressApp.use(bodyParser.urlencoded({ extended: true }))
  expressApp.use(bodyParser.json())
  expressApp.use(cookieParser())

  expressApp.get(`/api/${scc.url.API_VERSION}/auth/connect`, (req, res) => {
    const user = req.session.auth?.user
    const { clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod } = lib.paramSnakeToCamel(req.query)
    const resultHandleConnect = actionHandleConnect(user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod)
    output(req, res, resultHandleConnect)
  })
  expressApp.post('/f/login/credential/check', async (req, res) => {
    const { emailAddress, passHmac2 } = lib.paramSnakeToCamel(req.body)
    const resultHandleCredentialCheck = await actionHandleCredentialCheck(emailAddress, passHmac2, req.session.auth, coreCredentialCheck)
    output(req, res, resultHandleCredentialCheck)
  })
  expressApp.post('/f/confirm/permission/check', (req, res) => {
    const { permissionList } = lib.paramSnakeToCamel(req.body)
    const resultHandleConfirm = actionHandleConfirm(permissionList, req.session.auth)
    output(req, res, resultHandleConfirm)
  })
  expressApp.get(`/api/${scc.url.API_VERSION}/auth/code`, (req, res) => {
    const { clientId, state, code, codeVerifier } = lib.paramSnakeToCamel(req.query)
    const authSession = AUTH_SESSION_LIST[code]
    const resultHandleCode = actionHandleCode(clientId, state, code, codeVerifier, authSession, coreRegisterAccessToken)
    output(req, res, resultHandleCode)
  })
  expressApp.get(`/api/${scc.url.API_VERSION}/user/info`, (req, res) => {
    const accessToken = req.headers['authorization'].slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { filterKeyListStr } = lib.paramSnakeToCamel(req.query)

    const resultHandleUserInfo = handleUserInfo(clientId, accessToken, filterKeyListStr, coreGetUserByAccessToken)
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

  expressApp.use(express.static(process.env.APP_PATH + scc.server.PUBLIC_BUILD_DIR, { index: 'index.html', extensions: ['html'] }))
  expressApp.use(express.static(process.env.APP_PATH + scc.server.PUBLIC_STATIC_DIR, { index: 'index.html', extensions: ['html'] }))

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

