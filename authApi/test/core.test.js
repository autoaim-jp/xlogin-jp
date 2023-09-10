import init from './init.js'
import ulid from 'ulid'
import pg from 'pg'

import core from '../core.js'

import { TEST_PARAM, EXPECTED_PARAM } from './core/param.js'
import coreLogin from './core/login.js'

beforeAll(async () => {
  jest.spyOn(console, 'error').mockImplementation()
  await init.init()
  await init.insertTestData()
}, 30 * 1000)

/*
afterAll(async () => {
  await init.end()
})
*/

describe('success login', () => {
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
   * testId: A1000-3,A1000-4
   * function: handleConnect
   */
  test('A1000-3,A1000-4 handleConnect', coreLogin.handleConnect({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A3000-2
   * function: handleCredentialCheck
   */
  test('A3000-2 handleCredentialCheck', coreLogin.handleCredentialCheck({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A4000-1
   * function: handleThrough
   */
  test('A4000-1 handleThrough', coreLogin.handleThroughReturnNotFound({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A4000-1
   * function: handleConfirm
   */
  test('A4000-1 handleConfirm', coreLogin.handleConfirm({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A5000-2
   * function: handleCode
   */
  test('A5000-2 handleCode', coreLogin.handleCode({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A1000-1
   * function: handleUserInfo
   */
  test('B1000-1 handleUserInfo', coreLogin.handleUserInfo({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)
})

describe('success through', () => {
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
   * testId: A1000-3,A1000-4
   * function: handleConnect
   */
  test('A1000-3,A1000-4 handleConnect', coreLogin.handleConnect({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A3000-2
   * function: handleCredentialCheck
   */
  test('A3000-2 handleCredentialCheck', coreLogin.handleCredentialCheck({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A4000-1
   * function: handleThrough
   */
  test('A4000-1 handleThrough', coreLogin.handleThroughReturnNotFound({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A4000-1
   * function: handleConfirm
   */
  test('A4000-1 handleConfirm', coreLogin.handleConfirm({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A5000-2
   * function: handleCode
   */
  test('A5000-2 handleCode', coreLogin.handleCode({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A1000-3,A1000-4
   * function: handleConnect
   */
  test('A1000-3,A1000-4 handleConnect 2', coreLogin.handleConnect({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A3000-2
   * function: handleCredentialCheck
   */
  test('A3000-2 handleCredentialCheck 2', coreLogin.handleCredentialCheck({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A4000-1
   * function: handleThrough
   */
  test('A4000-1 handleThrough 2', coreLogin.handleThroughReturnRedirect({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)

  /**
   * testId: A5000-2
   * function: handleCode
   */
  test('A5000-2 handleCode 2', coreLogin.handleCode({ core, TEST_PARAM, EXPECTED_PARAM }), 10 * 1000)


  /*
test('handleUserInfo', async () => {
    const argList = {
      clientId: 'sample_localhost',
      accessToken: '2Upv9RxTrEoin-AvqBtrmGsm0E74guOB7VirKOgt2D3qLOIPR7G0UyUArBTU2rkk',
      filterKeyListStr: 'auth:emailAddress,auth:backupEmailAddress,auth:userName,sample_localhost:serviceUserId,sample_localhost:notification,sample_localhost:file',
    }

    const handleResult = await core.handleUserInfo(argList)
    console.log(handleResult)
})
*/

})

