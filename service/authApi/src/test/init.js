import fs from 'fs'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { ulid } from 'ulid'
import pg from 'pg'
import winston from 'winston'

import setting from '../setting/index.js'
import output from '../output/index.js'
import core from '../core/index.js'
import input from '../input/index.js'
import action from '../action.js'
import lib from '../lib/index.js'

const asocial = {
  app: null, setting, output, core, input, action, lib,
}
const a = asocial

const init = async () => {
  dotenv.config({ path: './.testenv' })
  a.lib.init({ ulid, crypto, winston })
  a.setting.init(process.env)
  a.output.init({ setting, fs })
  a.core.init({ setting, output, input, lib })
  a.input.init({ setting, fs })
  const pgPool = a.core.createPgPool({ pg })
  a.lib.backendServerLib.setPgPool({ pgPool })
  a.lib.backendServerLib.monkeyPatch({ SERVICE_NAME: a.setting.getValue('env.SERVICE_NAME') })
}

const insertTestData = async () => {
  const emailAddress = 'user@example.com'
  const passPbkdf2 = '608df625890a932e8b3a8f98de97c67be27de458ea0d47d386c0cbe9cc6da634217bb38e68ffd70c0d19795beaea1526d259798fb8f3523ff35818ade13ec43d'
  const saltHex = '54db99ef94ad1c03bed54cd8bce1bb2f3de102f787c672a701313203e40d5fc037adb63728e3217fc79eda2bc6bee5682ea10956159a053cd0fa0f41038ac96e'
  const userName = 'test user'
  const execQuery = a.lib.backendServerLib.execQuery
  await a.output.registerUserByEmailAddress({ emailAddress, passPbkdf2, saltHex, userName, execQuery })
}

const deleteAllData = async ({ cleanupTableList }) => {
  const execQuery = a.lib.backendServerLib.execQuery
  const queryList = cleanupTableList.map((tableName) => {
    return `truncate table ${tableName}`
  })
  for (const query of queryList) {
    await execQuery({ query })
  }
}

const end = async () => {
  await a.lib.backendServerLib.closePgPool()
}

export default {
  init,
  insertTestData,
  deleteAllData,
  end,
}

