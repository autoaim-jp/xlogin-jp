import init from './init.js'
import ulid from 'ulid'
import pg from 'pg'

import core from '../core/index.js'

import { TEST_PARAM as _TEST_PARAM, EXPECTED_PARAM as _EXPECTED_PARAM } from './core/param.js'
import coreJson from './core/json.js'


beforeAll(async () => {
  jest.spyOn(console, 'error').mockImplementation()
  await init.init()
  await init.insertTestData()
}, 30 * 1000)

describe('C update json success', () => {
  const TEST_PARAM = JSON.parse(JSON.stringify(_TEST_PARAM))
  const EXPECTED_PARAM = JSON.parse(JSON.stringify(_EXPECTED_PARAM))

  afterAll(async () => {
    const cleanupTableList = [
      //'user_info.user_list',
      //'user_info.credential_list',
      'user_info.personal_data_list',
      'user_info.service_user_list',
      //'access_info.client_list',
      //'access_info.secret_list',
      'access_info.access_token_list',
      'access_info.auth_session_list',
      'notification_info.opened_notification_list',
      'notification_info.notification_list',
      'file_info.file_list',
    ]

    await init.deleteAllData({ cleanupTableList })
    await init.insertTestData()
  })

  /**
   * testId: C1010 
   * function: handleJsonUpdate
   */
  test('C1010 handleJsonUpdate', coreJson.handleJsonUpdate({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)


  /**
   * testId: C1021 
   * function: handleJsonContent
   */
  test('C1021 handleJsonContent', coreJson.handleJsonContent({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: C1030 
   * function: handleJsonDelete
   */
  test('C1030 handleJsonDelete', coreJson.handleJsonDelete({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

})

describe('C save file success', () => {
  const TEST_PARAM = JSON.parse(JSON.stringify(_TEST_PARAM))
  const EXPECTED_PARAM = JSON.parse(JSON.stringify(_EXPECTED_PARAM))

  /*
  afterAll(async () => {
    const cleanupTableList = [
      //'user_info.user_list',
      //'user_info.credential_list',
      'user_info.personal_data_list',
      'user_info.service_user_list',
      //'access_info.client_list',
      //'access_info.secret_list',
      'access_info.access_token_list',
      'access_info.auth_session_list',
      'notification_info.opened_notification_list',
      'notification_info.notification_list',
      'file_info.file_list',
    ]

    await init.deleteAllData({ cleanupTableList })
    await init.insertTestData()
  })
  */

  /**
   * testId: C2010 
   * function: handleFileCreate
   */
  // test('C2010 handleFileCreate', coreFile.handleFileCreate({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: C2041 
   * function: handleFileList
   */
  // test('C2041 handleFileList', coreFile.handleFileList({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: C2021 
   * function: handleFileContent
   */
  // test('C2021 handleFileContent', coreFile.handleFileContent({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

})

afterAll(async () => {
  await init.end()
})

