import fs from 'fs'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { ulid } from 'ulid'
import pg from 'pg'

import setting from '../setting/index.js'
import output from '../output.js'
import core from '../core.js'
import input from '../input.js'
import action from '../action.js'
import lib from '../lib.js'

const asocial = {
  app: null, setting, output, core, input, action, lib,
}
const a = asocial

const init = async () => {
  // debug
  // const ulid = { ulid: () => { return '01ARZ3NDEKTSV4RRFFQ69G5FAV' } }
  dotenv.config({ path: './.testenv' })
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

const insertTestData = async () => {
  const emailAddress = 'user@example.com'
  const passPbkdf2 = '608df625890a932e8b3a8f98de97c67be27de458ea0d47d386c0cbe9cc6da634217bb38e68ffd70c0d19795beaea1526d259798fb8f3523ff35818ade13ec43d'
  const saltHex = '54db99ef94ad1c03bed54cd8bce1bb2f3de102f787c672a701313203e40d5fc037adb63728e3217fc79eda2bc6bee5682ea10956159a053cd0fa0f41038ac96e'
  const userName = 'test user'
  const execQuery = a.lib.execQuery
  await a.output.registerUserByEmailAddress(emailAddress, passPbkdf2, saltHex, userName, execQuery)
}
const end = async () => {
  await a.lib.closePgPool()
}

export default {
  init,
  insertTestData,
  end,
}

