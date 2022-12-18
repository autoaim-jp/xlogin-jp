/* /app.js */
/**
 * @name エントリポイントのファイル
 * @memberof file
 */
import fs from 'fs'
import https from 'https'
import crypto from 'crypto'
import ulid from 'ulid'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import Redis from 'ioredis'
import RedisStore from 'connect-redis'
import dotenv from 'dotenv'
import path from 'path'
import expressUseragent from 'express-useragent'
import pg from 'pg'

import setting from './setting/index.js'
import output from './output.js'
import core from './core.js'
import input from './input.js'
import action from './action.js'
import lib from './lib.js'

/**
 * 全リクエストのセッションを初期化するExpressのルーター
 * リクエストの前、つまり最初に呼び出す
 * @memberof function
 */
const _getSessionRouter = () => {
  const expressRouter = express.Router()
  const redis = new Redis({
    port: setting.session.REDIS_PORT,
    host: setting.session.REDIS_HOST,
    db: setting.session.REDIS_DB,
  })

  expressRouter.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    rolling: true,
    name: setting.session.SESSION_ID,
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

const _getExpressMiddlewareRouter = () => {
  const expressRouter = express.Router()
  expressRouter.use(bodyParser.urlencoded({ extended: true }))
  expressRouter.use(bodyParser.json())
  expressRouter.use(cookieParser())
  expressRouter.use(expressUseragent.express())
  return expressRouter
}

const _getOidcRouter = () => {
  const expressRouter = express.Router()
  /**
   * サービスでログインボタンがクリックされたときに、最初に来るAPI
   * @name connect API
   * @memberof feature
   */
  expressRouter.get(`/api/${setting.url.API_VERSION}/auth/connect`, (req, res) => {
    const user = req.session.auth?.user
    const {
      clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, requestScope,
    } = lib.paramSnakeToCamel(req.query)
    const resultHandleConnect = action.handleConnect(user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, requestScope, core.isValidClient)
    output.endResponse(req, res, resultHandleConnect)
  })

  /**
   * 認可コードを発行するAPI
   * @name authCode API
   * @memberof feature
   */
  expressRouter.get(`/api/${setting.url.API_VERSION}/auth/code`, async (req, res) => {
    const {
      clientId, state, code, codeVerifier,
    } = lib.paramSnakeToCamel(req.query)
    const resultHandleCode = await action.handleCode(clientId, state, code, codeVerifier, core.registerAccessToken, core.getAuthSessionByCode)
    output.endResponse(req, res, resultHandleCode)
  })
  return expressRouter
}

const _getUserApiRouter = () => {
  const expressRouter = express.Router()
  expressRouter.get(`/api/${setting.url.API_VERSION}/user/info`, (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { filterKeyListStr } = lib.paramSnakeToCamel(req.query)

    const resultHandleUserInfo = action.handleUserInfo(clientId, accessToken, filterKeyListStr, core.getUserByAccessToken)
    output.endResponse(req, res, resultHandleUserInfo)
  })
  expressRouter.post(`/api/${setting.url.API_VERSION}/user/update`, (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { backupEmailAddress } = lib.paramSnakeToCamel(req.body)

    const resultHandleUserInfoUpdate = action.handleUserInfoUpdate(clientId, accessToken, backupEmailAddress, core.updateBackupEmailAddressByAccessToken)
    output.endResponse(req, res, resultHandleUserInfoUpdate)
  })
  return expressRouter
}

const _getNotificationApiRouter = () => {
  const expressRouter = express.Router()

  expressRouter.get(`/api/${setting.url.API_VERSION}/notification/list`, (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange } = lib.paramSnakeToCamel(req.query)

    const resultHandleNotification = action.handleNotification(clientId, accessToken, notificationRange, core.getNotificationByAccessToken)
    output.endResponse(req, res, resultHandleNotification)
  })

  expressRouter.post(`/api/${setting.url.API_VERSION}/notification/append`, (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange, subject, detail } = lib.paramSnakeToCamel(req.body)

    const resultHandleNotificationAppend = action.handleNotificationAppend(clientId, accessToken, notificationRange, subject, detail, core.appendNotificationByAccessToken)
    output.endResponse(req, res, resultHandleNotificationAppend)
  })

  expressRouter.post(`/api/${setting.url.API_VERSION}/notification/open`, (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange, notificationIdList } = lib.paramSnakeToCamel(req.body)

    const resultHandleNotificationOpen = action.handleNotificationOpen(clientId, accessToken, notificationRange, notificationIdList, core.openNotificationByAccessToken)
    output.endResponse(req, res, resultHandleNotificationOpen)
  })

  return expressRouter
}

const _getFileRouter = () => {
  const expressRouter = express.Router()
  expressRouter.post(`/api/${setting.url.API_VERSION}/file/update`, async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath, content } = lib.paramSnakeToCamel(req.body)

    const resultHandleFileUpdate = await action.handleFileUpdate(clientId, accessToken, owner, filePath, content, core.updateFileByAccessToken)
    output.endResponse(req, res, resultHandleFileUpdate)
  })

  expressRouter.get(`/api/${setting.url.API_VERSION}/file/content`, async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = lib.paramSnakeToCamel(req.query)

    const resultHandleFileContent = await action.handleFileContent(clientId, accessToken, owner, filePath, core.getFileContentByAccessToken)
    output.endResponse(req, res, resultHandleFileContent)
  })

  expressRouter.post(`/api/${setting.url.API_VERSION}/file/delete`, async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = lib.paramSnakeToCamel(req.body)

    const resultHandleFileDelete = await action.handleFileDelete(clientId, accessToken, owner, filePath, core.updateFileByAccessToken)
    output.endResponse(req, res, resultHandleFileDelete)
  })

  expressRouter.get(`/api/${setting.url.API_VERSION}/file/list`, async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = lib.paramSnakeToCamel(req.query)

    const resultHandleFileList = await action.handleFileList(clientId, accessToken, owner, filePath, core.getFileListByAccessToken)
    output.endResponse(req, res, resultHandleFileList)
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

  expressRouter.post(`${setting.bsc.apiEndpoint}/confirm/through/check`, async (req, res) => {
    const { useragent } = req
    const ipAddress = req.headers['x-forwarded-for'] || req.ip
    const resultHandleThrough = await action.handleThrough(ipAddress, useragent, req.session.auth, core.registerAuthSession, core.appendLoginNotification, core.registerServiceUserId, core.getCheckedRequiredPermissionList)
    output.endResponse(req, res, resultHandleThrough)
  })

  expressRouter.post(`${setting.bsc.apiEndpoint}/confirm/permission/check`, async (req, res) => {
    const { useragent } = req
    const ipAddress = req.headers['x-forwarded-for'] || req.ip
    const { permissionList } = lib.paramSnakeToCamel(req.body)
    const resultHandleConfirm = await action.handleConfirm(ipAddress, useragent, permissionList, req.session.auth, core.registerAuthSession, core.appendLoginNotification, core.registerServiceUserId)
    output.endResponse(req, res, resultHandleConfirm)
  })

  expressRouter.post(`${setting.bsc.apiEndpoint}/login/user/add`, (req, res) => {
    const {
      emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked,
    } = req.body
    const resultHandleUserAdd = action.handleUserAdd(emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, req.session.auth, core.addUser, core.getUserByEmailAddress)
    output.endResponse(req, res, resultHandleUserAdd)
  })

  expressRouter.get(`${setting.bsc.apiEndpoint}/confirm/scope/list`, (req, res) => {
    const resultHandleScope = action.handleScope(req.session.auth)
    output.endResponse(req, res, resultHandleScope)
  })

  expressRouter.get(`${setting.bsc.apiEndpoint}/notification/global/list`, (req, res) => {
    const resultHandleNotification = action.handleGlobalNotification(req.session.auth, core.getNotification)
    output.endResponse(req, res, resultHandleNotification)
  })

  return expressRouter
}

const _getOtherRouter = () => {
  const expressRouter = express.Router()

  expressRouter.get('/logout', (req, res) => {
    const resultHandleLogout = action.handleLogout()
    output.endResponse(req, res, resultHandleLogout)
  })

  const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
  expressRouter.use(express.static(appPath + setting.server.PUBLIC_BUILD_DIR, { index: 'index.html', extensions: ['html'] }))
  expressRouter.use(express.static(appPath + setting.server.PUBLIC_STATIC_DIR, { index: 'index.html', extensions: ['html'] }))

  return expressRouter
}

const _getErrorRouter = () => {
  const expressRouter = express.Router()
  expressRouter.use((req, res, next) => {
    console.log('debug:', req.path, req.query, req.body)
    res.status(500)
    res.end('Internal Server Error')
    return next()
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

const main = async () => {
  dotenv.config()
  lib.init(crypto, ulid)
  output.init(setting, fs)
  core.init(setting, output, input, lib)
  input.init(setting, fs)
  action.init(setting, lib)
  const pgPool = core.createPgPool(pg)
  lib.setPgPool(pgPool)

  await lib.waitForPsql()

  const expressApp = express()

  expressApp.use(_getSessionRouter())
  expressApp.use(_getExpressMiddlewareRouter())

  expressApp.use(_getOidcRouter())
  expressApp.use(_getUserApiRouter())
  expressApp.use(_getNotificationApiRouter())
  expressApp.use(_getFunctionRouter())
  expressApp.use(_getFileRouter())
  expressApp.use(_getOtherRouter())

  expressApp.use(_getErrorRouter())

  startServer(expressApp)

  console.log(`open: http://${process.env.SERVER_ORIGIN}/`)
}

main()

