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

  expressApp.use(_getExpressMiddlewareRouter())

  expressApp.use(_getFileRouter())

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

