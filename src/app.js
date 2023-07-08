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

const asocial = {
  setting, output, core, input, action, lib, 
}
const a = asocial


/**
 * 全リクエストのセッションを初期化するExpressのルーター
 * リクエストの前、つまり最初に呼び出す
 * @memberof function
 */
const _getSessionRouter = () => {
  const expressRouter = express.Router()
  const redis = new Redis({
    port: setting.getValue('session.REDIS_PORT'),
    host: setting.getValue('session.REDIS_HOST'),
    db: setting.getValue('session.REDIS_DB'),
  })

  expressRouter.use(session({
    secret: setting.getValue('env.SESSION_SECRET'),
    resave: true,
    saveUninitialized: true,
    rolling: true,
    name: setting.getValue('session.SESSION_ID'),
    cookie: {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: setting.getValue('session.SESSION_COOKIE_SECURE'),
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

  const checkSignature = action.getHandlerCheckSignature(argNamed({
    core: [a.core.isValidSignature],
    output: [a.output.endResponse],
  }))

  /**
   * サービスでログインボタンがクリックされたときに、最初に来るAPI
   * @name connect API
   * @memberof feature
   */
  const connectHandler = action.getHandlerConnect(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleConnect],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${setting.getValue('url.API_VERSION')}/auth/connect`, connectHandler)

  /**
   * 認可コードを発行するAPI
   * @name authCode API
   * @memberof feature
   */
  const codeHandler = action.getHandlerCode(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleCode],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${setting.getValue('url.API_VERSION')}/auth/code`, checkSignature, codeHandler)
  return expressRouter
}

const _getUserApiRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = action.getHandlerCheckSignature(argNamed({
    core: [a.core.isValidSignature],
    output: [a.output.endResponse],
  }))

  const userInfoHandler = action.getHandlerUserInfo(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleUserInfo],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${setting.getValue('url.API_VERSION')}/user/info`, checkSignature, userInfoHandler)

  const userInfoUpdateHandler = action.getHandlerUserInfoUpdate(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleUserInfoUpdate],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${setting.getValue('url.API_VERSION')}/user/update`, checkSignature, userInfoUpdateHandler)

  return expressRouter
}

const _getNotificationApiRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = action.getHandlerCheckSignature(argNamed({
    core: [a.core.isValidSignature],
    output: [a.output.endResponse],
  }))

  const notificationListHandler = action.getHandlerNotificationList(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleNotificationList],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${setting.getValue('url.API_VERSION')}/notification/list`, checkSignature, notificationListHandler)

  const notificationAppendHandler = action.getHandlerNotificationAppend(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleNotificationAppend],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${setting.getValue('url.API_VERSION')}/notification/append`, checkSignature, notificationAppendHandler)

  const notificationOpenHandler = action.getHandlerNotificationOpen(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleNotificationOpen],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${setting.getValue('url.API_VERSION')}/notification/open`, checkSignature, notificationOpenHandler)

  return expressRouter
}

const _getFileRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = action.getHandlerCheckSignature(argNamed({
    core: [a.core.isValidSignature],
    output: [a.output.endResponse],
  }))

  const fileUpdateHandler = action.getHandlerFileUpdate(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileUpdate],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${setting.getValue('url.API_VERSION')}/file/update`, checkSignature, fileUpdateHandler)

  const fileContentHandler = action.getHandlerFileContent(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileContent],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${setting.getValue('url.API_VERSION')}/file/content`, checkSignature, fileContentHandler)

  const fileDeleteHandler = action.getHandlerFileDelete(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileDelete],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${setting.getValue('url.API_VERSION')}/file/delete`, checkSignature, fileDeleteHandler)

  const fileListHandler = action.getHandlerFileList(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileList],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${setting.getValue('url.API_VERSION')}/file/list`, checkSignature, fileListHandler)

  return expressRouter
}

const _getFunctionRouter = () => {
  const expressRouter = express.Router()

  const credentialCheckHandler = action.getHandlerCredentialCheck(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleCredentialCheck],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`${setting.browserServerSetting.getValue('apiEndpoint')}/login/credential/check`, credentialCheckHandler)

  const throughCheckHandler = action.getHandlerThroughCheck(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleThrough],
  }))
  expressRouter.post(`${setting.browserServerSetting.getValue('apiEndpoint')}/confirm/through/check`, throughCheckHandler)

  const permissionCheckHandler = action.getHandlerPermissionCheck(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleConfirm],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`${setting.browserServerSetting.getValue('apiEndpoint')}/confirm/permission/check`, permissionCheckHandler)

  const userAddHandler = action.getHandlerUserAdd(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleUserAdd],
  }))
  expressRouter.post(`${setting.browserServerSetting.getValue('apiEndpoint')}/login/user/add`, userAddHandler)

  const scopeListHandler = action.getHandlerScopeList(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleScope],
  }))
  expressRouter.get(`${setting.browserServerSetting.getValue('apiEndpoint')}/confirm/scope/list`, scopeListHandler) 

  /* TODO checkSignatureで検証しなくてよいのか？ */
  const globalNotificationHandler = action.getHandlerGlobalNotification(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleGlobalNotification],
  }))
  expressRouter.get(`${setting.browserServerSetting.getValue('apiEndpoint')}/notification/global/list`, globalNotificationHandler)


  return expressRouter
}

const _getOtherRouter = () => {
  const expressRouter = express.Router()

  const handleLogoutHandler = action.getHandlerHandleLogout(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleLogout],
  }))
  expressRouter.get('/logout', handleLogoutHandler)

  const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
  expressRouter.use(express.static(appPath + setting.getValue('server.PUBLIC_BUILD_DIR'), { index: 'index.html', extensions: ['html'] }))
  expressRouter.use(express.static(appPath + setting.getValue('server.PUBLIC_STATIC_DIR'), { index: 'index.html', extensions: ['html'] }))

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
  if (setting.getValue('env.SERVER_ORIGIN').indexOf('https') >= 0) {
    const tlsConfig = {
      key: fs.readFileSync(setting.getValue('env.TLS_KEY_PATH')),
      cert: fs.readFileSync(setting.getValue('env.TLS_CERT_PATH')),
    }
    const server = https.createServer(tlsConfig, expressApp)
    server.listen(setting.getValue('env.SERVER_PORT'), () => {
      console.log(`xlogin.jp listen to port: ${setting.getValue('env.SERVER_PORT')}, origin: ${setting.getValue('env.SERVER_ORIGIN')}`)
    })
  } else {
    expressApp.listen(setting.getValue('env.SERVER_PORT'), () => {
      console.log(`xlogin.jp listen to port: ${setting.getValue('env.SERVER_PORT')}, origin: ${setting.getValue('env.SERVER_ORIGIN')}`)
    })
  }
}

const main = async () => {
  dotenv.config()
  lib.monkeyPatch()
  lib.init(crypto, ulid)
  setting.init(process.env)
  output.init(setting, fs)
  core.init(setting, output, input, lib)
  input.init(setting, fs)
  const pgPool = core.createPgPool(pg)
  lib.setPgPool(pgPool)

  await lib.waitForPsql(setting.getValue('startup.MAX_RETRY_PSQL_CONNECT_N'))

  const expressApp = express()

  expressApp.use(_getSessionRouter())
  expressApp.use(_getExpressMiddlewareRouter())

  expressApp.use(_getOidcRouter())
  expressApp.use(_getUserApiRouter())
  expressApp.use(_getNotificationApiRouter())
  expressApp.use(_getFileRouter())
  expressApp.use(_getFunctionRouter())
  expressApp.use(_getOtherRouter())

  expressApp.use(_getErrorRouter())

  startServer(expressApp)

  console.log(`open: http://${setting.getValue('env.SERVER_ORIGIN')}/`)
}

main()

