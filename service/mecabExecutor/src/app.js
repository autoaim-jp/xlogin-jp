import fs from 'fs'
import MecabAsync from 'mecab-async'
import dotenv from 'dotenv'
import amqplib from 'amqplib'
import winston from 'winston'

import setting from './setting.js'
import core from './core.js'
import lib from './lib/index.js'

const asocial = {
  setting, core, lib,
}
const a = asocial

const init = async () => {
  dotenv.config()
  a.setting.init({ env: process.env })
  a.lib.init({ winston })
  a.lib.backendServerLib.monkeyPatch({ SERVICE_NAME: a.setting.getValue('env.SERVICE_NAME') })

  const {
    AMQP_USER: user, AMQP_PASS: pass, AMQP_HOST: host, AMQP_PORT: port,
  } = a.setting.getList('env.AMQP_USER', 'env.AMQP_PASS', 'env.AMQP_HOST', 'env.AMQP_PORT')
  const amqpConnection = await a.lib.createAmqpConnection({
    amqplib, user, pass, host, port,
  })
  const mecab = new MecabAsync()
  await core.init({
    setting, lib, amqpConnection, mecab,
  })
}

const main = async () => {
  await a.app.init()
  a.core.startConsumer()
  fs.writeFileSync('/tmp/setup.done', '0')
  logger.info('ready to accept text parse request through amqp')
}

const app = {
  init,
  main,
}
asocial.app = app

main()

export default app

