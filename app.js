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

import setting from './setting/index.js'
import output from './output.js'
import core from './core.js'
import input from './input.js'
import action from './action.js'
import lib from './lib.js'

const _getSessionRouter = () => {
  const expressRouter = express.Router()
  const redis = new Redis({
    port: setting.session.REDIS_PORT,
    host: setting.session.REDIS_HOST,
    db: setting.session.REDIS_DB,
  })

  expressRouter.use(session({
    secret : process.env.SESSION_SECRET, 
    resave : true,
    saveUninitialized : true,                
    rolling : true,
    name : setting.session.SESSION_ID,
    cookie: {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: setting.session.SESSION_COOKIE_SECURE,
      httpOnly: true,
      sameSite: 'lax',
    },
    store: new (RedisStore(session))({ client: redis }),
  }))
  return expressRouter
}

const _getOidcRouter = () => {
  const expressRouter = express.Router()
  expressRouter.get(`/api/${setting.url.API_VERSION}/auth/connect`, (req, res) => {
    const user = req.session.auth?.user
    const { clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod } = lib.paramSnakeToCamel(req.query)
    const resultHandleConnect = action.handleConnect(user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, core.isValidClient)
    output.endResponse(req, res, resultHandleConnect)
  })
  expressRouter.get(`/api/${setting.url.API_VERSION}/auth/code`, (req, res) => {
    const { clientId, state, code, codeVerifier } = lib.paramSnakeToCamel(req.query)
    const resultHandleCode = action.handleCode(clientId, state, code, codeVerifier, core.registerAccessToken, core.getAuthSessionByCode)
    output.endResponse(req, res, resultHandleCode)
  })
  expressRouter.get(`/api/${setting.url.API_VERSION}/user/info`, (req, res) => {
    const accessToken = req.headers['authorization'].slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { filterKeyListStr } = lib.paramSnakeToCamel(req.query)

    const resultHandleUserInfo = action.handleUserInfo(clientId, accessToken, filterKeyListStr, core.getUserByAccessToken)
    output.endResponse(req, res, resultHandleUserInfo)
  })
  return expressRouter
}

const _getFunctionRouter = () => {
  const expressRouter = express.Router()
  expressRouter.post(`${setting.bsc.apiEndpoint}/login/credential/check`, async (req, res) => {
    const { emailAddress, passHmac2 } = lib.paramSnakeToCamel(req.body)
    const resultHandleCredentialCheck = await action.handleCredentialCheck(emailAddress, passHmac2, req.session.auth, core.credentialCheck, core.getUserByEmailAddress)
    output.endResponse(req, res, resultHandleCredentialCheck)
  })
  expressRouter.post(`${setting.bsc.apiEndpoint}/confirm/permission/check`, (req, res) => {
    const { permissionList } = lib.paramSnakeToCamel(req.body)
    const resultHandleConfirm = action.handleConfirm(permissionList, req.session.auth, core.registerAuthSession)
    output.endResponse(req, res, resultHandleConfirm)
  })
  expressRouter.post(`${setting.bsc.apiEndpoint}/login/user/add`, (req, res) => {
    const { emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked } = req.body
    const resultHandleUserAdd = action.handleUserAdd(emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, req.session.auth, core.addUser, core.getUserByEmailAddress, core.registerUserByEmailAddress)
    output.endResponse(req, res, resultHandleUserAdd)
  })
  expressRouter.get(`${setting.bsc.apiEndpoint}/confirm/scope/read`, (req, res) => {
    const resultHandleScope = action.handleScope(req.session.auth)
    output.endResponse(req, res, resultHandleScope)
  })
  return expressRouter
}

const _getOtherRouter = () => {
  const expressRouter = express.Router()
  expressRouter.get('/logout', (req, res) => {
    const resultHandleLogout = action.handleLogout(req.session.auth)
    output.endResponse(req, res, resultHandleLogout)
  })

  const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
  expressRouter.use(express.static(appPath + setting.server.PUBLIC_BUILD_DIR, { index: 'index.html', extensions: ['html'] }))
  expressRouter.use(express.static(appPath + setting.server.PUBLIC_STATIC_DIR, { index: 'index.html', extensions: ['html'] }))

  return expressRouter
}

const _getErrorRouter = () => {
  const expressRouter = express.Router()
  expressRouter.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)
    res.end('Internal Server Error')
  })
  return expressRouter
}

const startServer = (expressApp) => {
  if (process.env.SERVER_ORIGIN.indexOf('https') >= 0) {
    const tlsConfig = {
      key: fs.readFileSync(process.env.TLS_KEY_PATH),
      cert: fs.readFileSync(process.env.TLS_CERT_PATH),
    }
    const server = https.createServer(tlsConfig, expressApp)
    server.listen(process.env.SERVER_PORT, () => {
      console.log(`xlogin.jp listen to port: ${process.env.SERVER_PORT}, origin: ${process.env.SERVER_ORIGIN}`)
    })
  } else {
    expressApp.listen(process.env.SERVER_PORT, () => {
      console.log(`xlogin.jp listen to port: ${process.env.SERVER_PORT}, origin: ${process.env.SERVER_ORIGIN}`)
    })
  }
}

const main = () => {
  dotenv.config()
  output.init(setting)
  core.init(setting, output, input, lib)
  input.init(setting)
  action.init(setting, lib)

  const expressApp = express()

  expressApp.use(_getSessionRouter())
  expressApp.use(bodyParser.urlencoded({ extended: true }))
  expressApp.use(bodyParser.json())
  expressApp.use(cookieParser())

  expressApp.use(_getOidcRouter())
  expressApp.use(_getFunctionRouter())
  expressApp.use(_getOtherRouter())

  expressApp.use(_getErrorRouter())

  startServer(expressApp)

  console.log(`open: http://${process.env.SERVER_ORIGIN}/`)
}

main()

