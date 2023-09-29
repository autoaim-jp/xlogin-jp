/* /app.js */
/**
 * @file
 * @name エントリポイントのファイル
 * @memberof app
 */
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { collectDefaultMetrics, register } from 'prom-client'

import setting from './setting/index.js'

const asocial = {
  setting,
}
const a = asocial

/**
 * _getMetricsRouter.
 *
 * @return {Express.Router()} Prometheusにmetricsを返すルーター
 * @memberof app
 */
const _getMetricsRouter = () => {
  const expressRouter = express.Router()
  expressRouter.get('/metrics', async (_req, res) => {
    try {
      res.set('Content-Type', register.contentType)
      res.end(await register.metrics())
    } catch (err) {
      res.status(500).end(err)
    }
  })
  return expressRouter
}

/**
 * _getStaticRouter.
 *
 * @return {Express.Router()} 静的ファイルを提供するルーター
 * @memberof app
 */
const _getStaticRouter = () => {
  const expressRouter = express.Router()

  const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
  expressRouter.use(express.static(appPath + a.setting.getValue('static.PUBLIC_BUILD_DIR'), { index: 'index.html', extensions: ['html'] }))
  expressRouter.use(express.static(appPath + a.setting.getValue('static.PUBLIC_STATIC_DIR'), { index: 'index.html', extensions: ['html'] }))

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
  a.setting.init(process.env)

  collectDefaultMetrics()
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

  expressApp.use(_getMetricsRouter())

  expressApp.use(_getStaticRouter())

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

