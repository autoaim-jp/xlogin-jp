/* /app.js */
/**
 * @file
 * @name エントリポイントのファイル
 * @memberof app
 */
import fs from 'fs'
import https from 'https'
import crypto from 'crypto'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

import setting from './setting/index.js'

const asocial = {
  setting,
}
const a = asocial

/**
 * _getStaticRouter.
 *
 * @return {Express.Router()} 静的ファイルを提供するルーター
 * @memberof app
 */
const _getStaticRouter = () => {
  const expressRouter = express.Router()

  const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
  expressRouter.use(express.static(appPath + setting.getValue('server.PUBLIC_BUILD_DIR'), { index: 'index.html', extensions: ['html'] }))
  expressRouter.use(express.static(appPath + setting.getValue('server.PUBLIC_STATIC_DIR'), { index: 'index.html', extensions: ['html'] }))

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
    res.status(404)
    res.end('Not Found')
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

/**
 * init.
 *
 * @return {undefined} 戻り値なし
 * @memberof app
 */
const init = async () => {
  dotenv.config()
  a.setting.init(process.env)
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

  expressApp.use(_getStaticRouter())

  expressApp.use(_getErrorRouter())

  startServer(expressApp)

  console.log(`open: http://${setting.getValue('env.SERVER_ORIGIN')}/`)
}

const app = {
  init,
  main,
}
asocial.app = app

main()

export default app

