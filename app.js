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

import statusList from './statusList.js'
import lib from './lib.js'
import core from './core.js'
import scc from './serverCommonConstant.js'

const CLIENT_LIST = {
  'foo': 'http://localhost:3001/f/xlogin/callback',
  'sample_xlogin_jp': 'https://sample.xlogin.jp/f/xlogin/callback'
}

const AUTH_SESSION_LIST = {}

/* GET /api/$apiVersion/auth/connect */
const actionHandleConnect = (user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, getErrorResponse) => {
  if (!CLIENT_LIST[clientId] || CLIENT_LIST[clientId] !== decodeURIComponent(redirectUri)) {
    const status = statusList.INVALID_CLIENT
    const error = 'handle_connect_client'
    return getErrorResponse(status, error, true)
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
const actionHandleCredentialCheck = async (emailAddress, passHmac2, authSession, credentialCheck, getErrorResponse, getUserByEmailAddress) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_credential_session'
    return getErrorResponse(status, error, false)
  }

  const resultCredentialCheck = await credentialCheck(lib.calcPbkdf2, emailAddress, passHmac2)
  if (resultCredentialCheck.credentialCheckResult !== true) {
    const status = statusList.INVALID_CREDENTIAL
    const error = 'handle_credential_credential'
    return getErrorResponse(status, error, false, null, authSession)
  }

  const user = getUserByEmailAddress(emailAddress)
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CONFIRM }) }, { user })
  const redirect = scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* POST /f/confirm/permission/check */
const actionHandleConfirm = (permissionList, authSession, getErrorResponse) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CONFIRM) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_confirm_session'
    return getErrorResponse(status, error, false)
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
const actionHandleCode = (clientId, state, code, codeVerifier, authSession, registerAccessToken, getErrorResponse) => {
  if (!authSession || !authSession.oidc || authSession.oidc['condition'] !== scc.condition.CODE) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_code_session'
    return getErrorResponse(status, error, true)
  }

  if (clientId !== authSession.oidc.clientId) {
    const status = statusList.INVALID_CLIENT
    const error = 'handle_code_client'
    return getErrorResponse(status, error, true)
  }

  const generatedCodeChallenge = lib.convertToCodeChallenge(codeVerifier, authSession.oidc.codeChallengeMethod)
  if (authSession.oidc.codeChallenge !== generatedCodeChallenge) {
    const status = statusList.INVALID_CODE_VERIFIER
    const error = 'handle_code_challenge'
    return getErrorResponse(status, error, true)
  }

  const accessToken = lib.getRandomB64UrlSafe(scc.oidc.ACCESS_TOKEN_L)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.USER_INFO }) })

  const resultRegisterAccessToken = registerAccessToken(clientId, accessToken, authSession.user, authSession.oidc.permissionList)
  if (!resultRegisterAccessToken) {
    const status = statusList.SERVER_ERROR
    const error = 'handle_code_access_token'
    return getErrorResponse(status, error, null)
  }

  const status = statusList.OK
  return { status, session: newUserSession, response: { result: { accessToken } }, redirect: null }
}

/* GET /api/$apiVersion/user/info */
const handleUserInfo = (clientId, accessToken, filterKeyListStr, getUserByAccessToken, getErrorResponse) => {
  const filterKeyList = filterKeyListStr.split(',')
  const userInfo = getUserByAccessToken(clientId, accessToken, filterKeyList)

  if (!userInfo) {
    const status = statusList.SERVER_ERROR
    const error = 'handle_user_info_access_token'
    return getErrorResponse(status, error, null)
  }

  const status = statusList.OK
  return { status, session: null, response: { result: { userInfo } }, redirect: null }
}

/* POST /f/login/user/add */
const actionHandleUserAdd = (emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, authSession, addUser, getErrorResponse, getUserByEmailAddress) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_user_add_session'
    return getErrorResponse(status, error, false)
  }

  if (isTosChecked !== true || isPrivacyPolicyChecked !== true) {
    const status = statusList.INVALID_CHECK
    const error = 'handle_user_add_checkbox'
    return getErrorResponse(status, error, false, null, authSession)
  }

  const clientId = authSession.oidc.clientId
  const resultAddUser = addUser(lib.getRandomB64UrlSafe, clientId, emailAddress, passPbkdf2, saltHex)
 
  if (resultAddUser.registerResult !== true) {
    const status = statusList.REGISTER_FAIL
    const error = 'handle_user_add_register'
    return getErrorResponse(status, error, false, null, authSession)
  }

  const user = getUserByEmailAddress(emailAddress)
 
  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: scc.condition.CONFIRM }) }, { user })
  const redirect = scc.url.AFTER_CHECK_CREDENTIAL
  
  const status = statusList.OK
  return { status, session: newUserSession, response: { redirect } }
}

/* GET /f/confirm/scope/list */
const actionHandleScope = (authSession, getErrorResponse) => {
  if (!authSession || !authSession.oidc) {
    const status = statusList.INVALID_SESSION
    const error = 'handle_permission_list_session'
    return getErrorResponse(status, error, false)
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
  dotenv.config()
  core.init(scc.user.SERVICE_USER_ID_L, scc.url.ERROR_PAGE)
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
    const resultHandleConnect = actionHandleConnect(user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, core.getErrorResponse)
    output(req, res, resultHandleConnect)
  })
  expressApp.post('/f/login/credential/check', async (req, res) => {
    const { emailAddress, passHmac2 } = lib.paramSnakeToCamel(req.body)
    const resultHandleCredentialCheck = await actionHandleCredentialCheck(emailAddress, passHmac2, req.session.auth, core.credentialCheck, core.getErrorResponse, core.getUserByEmailAddress)
    output(req, res, resultHandleCredentialCheck)
  })
  expressApp.post('/f/confirm/permission/check', (req, res) => {
    const { permissionList } = lib.paramSnakeToCamel(req.body)
    const resultHandleConfirm = actionHandleConfirm(permissionList, req.session.auth, core.getErrorResponse)
    output(req, res, resultHandleConfirm)
  })
  expressApp.get(`/api/${scc.url.API_VERSION}/auth/code`, (req, res) => {
    const { clientId, state, code, codeVerifier } = lib.paramSnakeToCamel(req.query)
    const authSession = AUTH_SESSION_LIST[code]
    const resultHandleCode = actionHandleCode(clientId, state, code, codeVerifier, authSession, core.registerAccessToken, core.getErrorResponse)
    output(req, res, resultHandleCode)
  })
  expressApp.get(`/api/${scc.url.API_VERSION}/user/info`, (req, res) => {
    const accessToken = req.headers['authorization'].slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { filterKeyListStr } = lib.paramSnakeToCamel(req.query)

    const resultHandleUserInfo = handleUserInfo(clientId, accessToken, filterKeyListStr, core.getUserByAccessToken, core.getErrorResponse)
    output(req, res, resultHandleUserInfo)
  })
  expressApp.post('/f/login/user/add', (req, res) => {
    const { emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked } = req.body
    const resultHandleUserAdd = actionHandleUserAdd(emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, req.session.auth, core.addUser, core.getErrorResponse, core.getUserByEmailAddress)
    output(req, res, resultHandleUserAdd)
  })
  expressApp.get('/f/confirm/scope/read', (req, res) => {
    const resultHandleScope = actionHandleScope(req.session.auth, core.getErrorResponse)
    output(req, res, resultHandleScope)
  })

  const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
  expressApp.use(express.static(appPath + scc.server.PUBLIC_BUILD_DIR, { index: 'index.html', extensions: ['html'] }))
  expressApp.use(express.static(appPath + scc.server.PUBLIC_STATIC_DIR, { index: 'index.html', extensions: ['html'] }))

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

