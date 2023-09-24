/* /app.js */
/**
 * @file
 * @name エントリポイントのファイル
 * @memberof app
 */
import fs from 'fs'
import crypto from 'crypto'
import { ulid } from 'ulid'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import expressUseragent from 'express-useragent'
import pg from 'pg'
import multer from 'multer'

import setting from './setting/index.js'
import output from './output.js'
import core from './core.js'
import input from './input.js'
import action from './action.js'
import lib from './lib/index.js'

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

  const jsonUpdateHandler = a.action.getHandlerJsonUpdate(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleJsonUpdate],
    lib: [a.lib.commonServerLib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/json/update`, checkSignature, jsonUpdateHandler)

  const jsonContentHandler = a.action.getHandlerJsonContent(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleJsonContent],
    lib: [a.lib.commonServerLib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/json/content`, checkSignature, jsonContentHandler)

  const jsonDeleteHandler = a.action.getHandlerJsonDelete(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleJsonDelete],
    lib: [a.lib.commonServerLib.paramSnakeToCamel],
  }))
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/json/delete`, checkSignature, jsonDeleteHandler)

  const fileListHandler = a.action.getHandlerFileList(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileList],
    lib: [a.lib.commonServerLib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/file/list`, checkSignature, fileListHandler)

  const fileContentHandler = a.action.getHandlerFileContent(argNamed({
    core: [a.core.handleFileContent],
    lib: [a.lib.commonServerLib.paramSnakeToCamel],
  }))
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/file/content`, checkSignature, fileContentHandler)


  return expressRouter
}

/**
 * _getFormRouter.
 *
 * @return {Express.Router()} フォームに関する処理を含むルーター
 * @memberof app
 */
const _getFormRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = a.action.getHandlerCheckSignature(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('statusList.INVALID_CREDENTIAL'),
    output: [a.output.endResponse],
    core: [a.core.isValidSignature],
  }))

  const formCreateHandler = a.action.getHandlerFileCreate(argNamed({
    output: [a.output.endResponse],
    core: [a.core.handleFileCreate],
  }))
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/file/create`, checkSignature, formCreateHandler)

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
  a.lib.commonServerLib.monkeyPatch()
  a.lib.init({ crypto, ulid, multer })
  a.setting.init(process.env)
  a.output.init(setting, fs)
  a.core.init(setting, output, input, lib)
  a.input.init(setting, fs)
  const pgPool = a.core.createPgPool(pg)
  a.lib.commonServerLib.setPgPool({ pgPool })
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
  expressApp.use(_getFormRouter())

  expressApp.use(_getErrorRouter())

  startServer(expressApp)

  console.log(`open: http://${a.setting.getValue('env.SERVER_ORIGIN')}/`)
  fs.writeFileSync('/tmp/setup.done', '0')
}

const app = {
  init,
  main,
}
asocial.app = app

main()

export default app

