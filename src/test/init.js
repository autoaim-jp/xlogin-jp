import fs from 'fs'
import dotenv from 'dotenv'
import crypto from 'crypto'
import ulid from 'ulid'
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

export default {
  init,
}

