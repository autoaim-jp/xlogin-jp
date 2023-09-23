/* /app.js */
/**
 * @file
 * @name エントリポイントのファイル
 * @memberof app
 */
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import Redis from 'ioredis'
import RedisStore from 'connect-redis'

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
  expressRouter.use(express.static(appPath + a.setting.getValue('static.PUBLIC_BUILD_DIR'), { index: 'index.html', extensions: ['html'] }))
  expressRouter.use(express.static(appPath + a.setting.getValue('static.PUBLIC_STATIC_DIR'), { index: 'index.html', extensions: ['html'] }))

  return expressRouter
}

/**
 * _getProtectedRouter.
 *
 * @return {Express.Router()} 全ページをパスワード保護するルーター
 * @memberof app
 */
const _getProtectedRouter = () => {
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
    store: new RedisStore({ client: redis }),
  }))

  expressRouter.use(bodyParser.urlencoded({ extended: true }))
  expressRouter.use(bodyParser.json())
  expressRouter.use(cookieParser())

  expressRouter.get('/protected', (req, res) => {
    const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
    req.session.protectedCheckDone = false
    express.static(appPath + a.setting.getValue('static.PUBLIC_BUILD_DIR'), { index: 'index.html', extensions: ['html'] })(req, res)
  })

  expressRouter.post('/protected/check', (req, res) => {
    if (process.env.PROTECTED_PASSWORD === req.body.pass) {
      req.session.protectedCheckDone = true
      return res.redirect(302, '/')
    }

    return res.redirect(302, '/protected')
  })

  expressRouter.use((req, res, next) => {
    // console.log({ path: req.path, sess: req.session })
    if(req.session && req.session.protectedCheckDone) {
      return next()
    }

    return res.redirect(302, '/protected')
  })
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

  expressApp.use(_getProtectedRouter())

  expressApp.use(_getStaticRouter())

  // expressApp.use(_getErrorRouter())

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

