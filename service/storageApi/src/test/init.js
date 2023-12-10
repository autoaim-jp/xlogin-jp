import fs from 'fs'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { ulid } from 'ulid'
import multer from 'multer'
import pg from 'pg'

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
  const ulid = { ulid: () => { return '01ARZ3NDEKTSV4RRFFQ69G5FAV' } }
  dotenv.config({ path: './.testenv' })
  a.lib.backendServerLib.monkeyPatch()
  a.lib.init({ crypto, ulid, multer })
  a.setting.init(process.env)
  a.output.init({ setting, fs })
  a.core.init({ setting, output, input, lib })
  a.input.init({ setting, fs })
  const pgPool = a.core.createPgPool({ pg })
  a.lib.backendServerLib.setPgPool({ pgPool })
}

const _registerUserByEmailAddress = async (emailAddress, passPbkdf2, saltHex, userName, execQuery) => {
  const queryAddUser = 'insert into user_info.user_list (email_address, user_name) values ($1, $2)'
  const paramListAddUser = [emailAddress, userName]

  await execQuery(queryAddUser, paramListAddUser)

  const queryAddCredential = 'insert into user_info.credential_list (email_address, pass_pbkdf2, salt_hex) values ($1, $2, $3)'
  const paramListAddCredential = [emailAddress, passPbkdf2, saltHex]

  await execQuery(queryAddCredential, paramListAddCredential)

  return true
}

const _registerAccessToken = async (clientId, accessToken, emailAddress, splitPermissionList, execQuery) => {
  const splitPermissionListStr = JSON.stringify(splitPermissionList)
  const query = 'insert into access_info.access_token_list (access_token, client_id, email_address, split_permission_list) values ($1, $2, $3, $4)'
  const paramList = [accessToken, clientId, emailAddress, splitPermissionListStr]

  const { result } = await execQuery({ query, paramList })
  const { rowCount } = result

  return rowCount
}

const insertTestData = async () => {
  const emailAddress = 'user@example.com'
  const passPbkdf2 = '608df625890a932e8b3a8f98de97c67be27de458ea0d47d386c0cbe9cc6da634217bb38e68ffd70c0d19795beaea1526d259798fb8f3523ff35818ade13ec43d'
  const saltHex = '54db99ef94ad1c03bed54cd8bce1bb2f3de102f787c672a701313203e40d5fc037adb63728e3217fc79eda2bc6bee5682ea10956159a053cd0fa0f41038ac96e'
  const userName = 'test user'
  const execQuery = a.lib.backendServerLib.execQuery
  await _registerUserByEmailAddress(emailAddress, passPbkdf2, saltHex, userName, execQuery)

  const accessToken = 'HREQxaXKQCvI4pMOJ4MA209-rQXbS0gr1sl4ENAdPLK5iAEHKWCrpHFy_jMJ8Qgt'
  const clientId = 'sample_localhost'
  const splitPermissionList = {
    required: {
      'r:auth:userName': true,
      'r:sample_localhost:serviceUserId': true,
      'rw:sample_localhost:notification': true
    },
    optional: {
      'r:auth:emailAddress': false,
      'rw:auth:backupEmailAddress': false,
      'rw:sample_localhost:file_v1': true,
      'rw:sample_localhost:json_v1': true
    }
  }

  await _registerAccessToken(clientId, accessToken, emailAddress, splitPermissionList, execQuery)
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

