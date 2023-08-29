/* /app.js */
/**
 * @file
 * @name エントリポイントのファイル
 * @memberof app
 */
import fs from 'fs'
import crypto from 'crypto'
import ulid from 'ulid'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import Redis from 'ioredis'
import RedisStore from 'connect-redis'
import dotenv from 'dotenv'
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
 *
 * @return {Express.Router()} セッション処理を含むルーター
 * @memberof app
 */
const _getSessionRouter = () => {
  const expressRouter = express.Router()
  const redis = new Redis({
    port: a.setting.getValue('session.REDIS_PORT'),
    host: a.setting.getValue('session.REDIS_HOST'),
    db: a.setting.getValue('session.REDIS_DB'),
  })

  expressRouter.use(session({
    secret: a.setting.getValue('env.SESSION_SECRET'),
    resave: true,
    saveUninitialized: true,
    rolling: true,
    name: a.setting.getValue('session.SESSION_ID'),
    cookie: {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: a.setting.getValue('session.SESSION_COOKIE_SECURE'),
      httpOnly: true,
      sameSite: 'lax',
    },
    store: new (RedisStore(session))({ client: redis }),
  }))
  return expressRouter
}

/**
 * _getExpressMiddlewareRouter.
 *
 * @return {Express.Router()} 基本のミドルウェアを含むルーター
 * @memberof app
 */
const _getExpressMiddlewareRouter = () => {
  const expressRouter = express.Router()
  expressRouter.use(bodyParser.urlencoded({ extended: true }))
  expressRouter.use(bodyParser.json())
  expressRouter.use(cookieParser())
  expressRouter.use(expressUseragent.express())
  return expressRouter
}

/**
 * _getOidcRouter.
 * 
 * @return {Express.Router()} OIDC認証に関する処理を含むルーター
 * @memberof app
 */
const _getOidcRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = a.action.getHandlerCheckSignature(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('statusList.INVALID_CREDENTIAL'),
    output: [a.output.endResponse],
    core: [a.core.isValidSignature],
  }))

  /**
   * サービスでログインボタンがクリックされたときに、最初に来るAPI
   * @name connect API
   * @memberof feature
   */
  const connectHandler = a.action.getHandlerConnect(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleConnect],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/auth/connect`, connectHandler)

  /**
   * 認可コードを発行するAPI
   * @name authCode API
   * @memberof feature
   */
  const codeHandler = a.action.getHandlerCode(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleCode],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/auth/code`, checkSignature, codeHandler)
  return expressRouter
}

/**
 * _getUserApiRouter.
 *
 * @return {Express.Router()} ユーザーAPIに関する処理を含むルーター
 * @memberof app
 */
const _getUserApiRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = a.action.getHandlerCheckSignature(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('statusList.INVALID_CREDENTIAL'),
    output: [a.output.endResponse],
    core: [a.core.isValidSignature],
  }))

  const userInfoHandler = a.action.getHandlerUserInfo(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleUserInfo],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/user/info`, checkSignature, userInfoHandler)

  const userInfoUpdateHandler = a.action.getHandlerUserInfoUpdate(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleUserInfoUpdate],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/user/update`, checkSignature, userInfoUpdateHandler)

  return expressRouter
}

/**
 * _getNotificationApiRouter.
 *
 * @return {Express.Router()} 通知に関する処理を含むルーター
 * @memberof app
 */
const _getNotificationApiRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = a.action.getHandlerCheckSignature(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('statusList.INVALID_CREDENTIAL'),
    output: [a.output.endResponse],
    core: [a.core.isValidSignature],
  }))


  const notificationListHandler = a.action.getHandlerNotificationList(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleNotificationList],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/notification/list`, checkSignature, notificationListHandler)

  const notificationAppendHandler = a.action.getHandlerNotificationAppend(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleNotificationAppend],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/notification/append`, checkSignature, notificationAppendHandler)

  const notificationOpenHandler = a.action.getHandlerNotificationOpen(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleNotificationOpen],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/notification/open`, checkSignature, notificationOpenHandler)

  return expressRouter
}

/**
 * _getFileRouter.
 *
 * @return {Express.Router()} ファイルに関する処理を含むルーター
 * @memberof app
 */
const _getFileRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = a.action.getHandlerCheckSignature(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('statusList.INVALID_CREDENTIAL'),
    output: [a.output.endResponse],
    core: [a.core.isValidSignature],
  }))


  const fileUpdateHandler = a.action.getHandlerFileUpdate(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileUpdate],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/file/update`, checkSignature, fileUpdateHandler)

  const fileContentHandler = a.action.getHandlerFileContent(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileContent],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/file/content`, checkSignature, fileContentHandler)

  const fileDeleteHandler = a.action.getHandlerFileDelete(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileDelete],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/file/delete`, checkSignature, fileDeleteHandler)

  const fileListHandler = a.action.getHandlerFileList(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileList],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/file/list`, checkSignature, fileListHandler)

  return expressRouter
}

/**
 * _getFunctionRouter.
 *
 * @return {Express.Router()} 認証に関する処理を含むルーター
 * @memberof app
 */
const _getFunctionRouter = () => {
  const expressRouter = express.Router()

  const credentialCheckHandler = a.action.getHandlerCredentialCheck(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleCredentialCheck],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`${a.setting.browserServerSetting.getValue('apiEndpoint')}/login/credential/check`, credentialCheckHandler)

  const throughCheckHandler = a.action.getHandlerThroughCheck(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleThrough],
  }))
  expressRouter.post(`${a.setting.browserServerSetting.getValue('apiEndpoint')}/confirm/through/check`, throughCheckHandler)

  const permissionCheckHandler = a.action.getHandlerPermissionCheck(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleConfirm],
    lib: [a.lib.paramSnakeToCamel],
  }))
  expressRouter.post(`${a.setting.browserServerSetting.getValue('apiEndpoint')}/confirm/permission/check`, permissionCheckHandler)

  const userAddHandler = a.action.getHandlerUserAdd(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleUserAdd],
  }))
  expressRouter.post(`${a.setting.browserServerSetting.getValue('apiEndpoint')}/login/user/add`, userAddHandler)

  const scopeListHandler = a.action.getHandlerScopeList(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleScope],
  }))
  expressRouter.get(`${a.setting.browserServerSetting.getValue('apiEndpoint')}/confirm/scope/list`, scopeListHandler)

  const globalNotificationHandler = a.action.getHandlerGlobalNotification(argNamed({
    setting: a.setting.getList('notification.ALL_NOTIFICATION'),
    output: [a.output.endResponse],
    core: [a.core.handleGlobalNotification],
  }))
  expressRouter.get(`${a.setting.browserServerSetting.getValue('apiEndpoint')}/notification/global/list`, globalNotificationHandler)

  const handleLogoutHandler = a.action.getHandlerHandleLogout(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleLogout],
  }))
  expressRouter.get(`${a.setting.browserServerSetting.getValue('apiEndpoint')}/logout`, handleLogoutHandler)

  return expressRouter
}

/**
 * _getErrorRouter.
 *
 * @return {Express.Router()} エラー処理を含むルーター
 * @memberof app
 */
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

/**
 * startServer.
 *
 * @param {} expressApp
 *
 * @return {undefined} 戻り値なし
 * @memberof app
 */
const startServer = (expressApp) => {
  expressApp.listen(a.setting.getValue('env.SERVER_PORT'), () => {
    console.log(`xlogin.jp listen to port: ${a.setting.getValue('env.SERVER_PORT')}, origin: ${a.setting.getValue('env.SERVER_ORIGIN')}`)
  })
}

/**
 * init.
 *
 * @return {undefined} 戻り値なし
 * @memberof app
 */
const init = async () => {
  dotenv.config()
  a.lib.monkeyPatch()
  a.lib.init(crypto, ulid)
  a.setting.init(process.env)
  a.output.init(setting, fs)
  a.core.init(setting, output, input, lib)
  a.input.init(setting, fs)
  const pgPool = a.core.createPgPool(pg)
  a.lib.setPgPool(pgPool)

  await a.lib.waitForPsql(a.setting.getValue('startup.MAX_RETRY_PSQL_CONNECT_N'))
}

/**
 * main.
 *
 * @return {undefined} 戻り値なし
 * @memberof app
 */
const main = async () => {
  await a.app.init()
  const expressApp = express()

  expressApp.use(_getSessionRouter())
  expressApp.use(_getExpressMiddlewareRouter())

  expressApp.use(_getOidcRouter())
  expressApp.use(_getUserApiRouter())
  expressApp.use(_getNotificationApiRouter())
  expressApp.use(_getFileRouter())
  expressApp.use(_getFunctionRouter())

  expressApp.use(_getErrorRouter())

  startServer(expressApp)

  console.log(`open: http://${a.setting.getValue('env.SERVER_ORIGIN')}/`)
}

const app = {
  init,
  main,
}
asocial.app = app

main()

export default app

