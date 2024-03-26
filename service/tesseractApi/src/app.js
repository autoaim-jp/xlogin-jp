import fs from 'fs'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { ulid } from 'ulid'
import pg from 'pg'
import express from 'express'
import amqplib from 'amqplib'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import expressUseragent from 'express-useragent'
import winston from 'winston'

import setting from './setting/index.js'
import output from './output/index.js'
import core from './core/index.js'
import input from './input/index.js'
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

const _getFunctionRouter = () => {
  const expressRouter = express.Router()

  const checkSignature = a.action.getHandlerCheckSignature(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('statusList.INVALID_CREDENTIAL'),
    output: [a.output.backendServerOutput.endResponse],
    core: [a.core.backendServerCore.isValidSignature],
  }))

  const registerRequestHandler = a.action.getHandlerRegisterRequest({
    handleRegisterRequest: a.core.handleRegisterRequest,
  })
  expressRouter.post(`/api/${a.setting.getValue('url.API_VERSION')}/tesseract/request`, checkSignature, registerRequestHandler)

  const lookupChatgptResponseHandler = a.action.getHandlerLookupChatgptResponse({
    handleLookupChatgptResponse: a.core.handleLookupChatgptResponse,
  })
  expressRouter.get(`/api/${a.setting.getValue('url.API_VERSION')}/tesseract/response`, checkSignature, lookupChatgptResponseHandler)

  return expressRouter
}

const _getErrorRouter = () => {
  const expressRouter = express.Router()

  expressRouter.get('*', (req, res) => {
    res.status(404)
    return res.end('not found')
  })

  return expressRouter
}

const startServer = ({ app, port }) => {
  app.listen(port, () => {
    logger.info(`listen to port: ${port}`)
  })
}

const init = async () => {
  dotenv.config()
  a.lib.init({ ulid, crypto, winston })
  a.setting.init({ env: process.env })
  a.output.init({ setting })
  const {
    AMQP_USER: user, AMQP_PASS: pass, AMQP_HOST: host, AMQP_PORT: port,
  } = a.setting.getList('env.AMQP_USER', 'env.AMQP_PASS', 'env.AMQP_HOST', 'env.AMQP_PORT')
  const amqpConnection = await a.lib.createAmqpConnection({
    amqplib, user, pass, host, port,
  })
  await core.init({
    setting, input, lib, amqpConnection,
  })
  a.input.init({ setting, fs })
  const pgPool = a.core.createPgPool({ pg })
  a.lib.backendServerLib.setPgPool({ pgPool })
  a.lib.backendServerLib.monkeyPatch({ SERVICE_NAME: a.setting.getValue('env.SERVICE_NAME') })
}

const main = async () => {
  await a.app.init()
  const expressApp = express()
  expressApp.disable('x-powered-by')

  expressApp.use(_getExpressMiddlewareRouter())

  expressApp.use(_getFunctionRouter())

  expressApp.use(_getErrorRouter())

  startServer({ app: expressApp, port: a.setting.getValue('env.SERVER_PORT') })

  a.core.startConsumer()
  fs.writeFileSync('/tmp/setup.done', '0')
}

const app = {
  init,
  main,
}
asocial.app = app

main()

export default app

