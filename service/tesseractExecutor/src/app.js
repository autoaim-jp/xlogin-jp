import fs from 'fs'
import dotenv from 'dotenv'
import amqplib from 'amqplib'
import winston from 'winston'
import { spawn } from 'child_process'
import { ulid } from 'ulid'

import setting from './setting.js'
import core from './core.js'
import output from './output.js'
import input from './input.js'
import lib from './lib/index.js'

const asocial = {
  setting, core, output, input, lib,
}
const a = asocial

const init = async () => {
  dotenv.config()
  a.setting.init({ env: process.env })
  a.lib.init({ ulid, winston, spawn })
  a.lib.backendServerLib.monkeyPatch({ SERVICE_NAME: a.setting.getValue('env.SERVICE_NAME') })
  const {
    AMQP_USER: user, AMQP_PASS: pass, AMQP_HOST: host, AMQP_PORT: port,
  } = a.setting.getList('env.AMQP_USER', 'env.AMQP_PASS', 'env.AMQP_HOST', 'env.AMQP_PORT')
  const amqpConnection = await a.lib.createAmqpConnection({
    amqplib, user, pass, host, port,
  })
  a.input.init({ fs })
  a.output.init({ fs })
  await a.core.init({
    setting, output, input, lib, amqpConnection,
  })
}

const main = async () => {
  await a.app.init()
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

