import init from './init.js'
import core from '../core.js'
import ulid from 'ulid'
import pg from 'pg'

beforeAll(async () => {
  jest.spyOn(console, 'error').mockImplementation()
  await init.init()
  await init.insertTestData()
}, 30 * 1000)

describe('A add user success', () => {
  const TEST_PARAM_COMMON = {
//    emailAddress: 'user@example.com',
//    userName: 'test user',
//    redirectUri: 'http://127.0.0.1:3001/f/xlogin/callback',
//    state: 'VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6',
//    scope: 'r:auth:emailAddress,rw:auth:backupEmailAddress,*r:auth:userName,*r:sample_localhost:serviceUserId,*rw:sample_localhost:notification,rw:sample_localhost:file',
//    responseType: 'code',
//    codeChallenge: 'O-7bvwRh5ZevD4MyZ-bcee3NbxH8ddyNvNLl4t-kaLE',
//    codeChallengeMethod: 'S256',
//    requestScope: '',
//    passHmac2: 'de9c2c84cc67f30892d2f6f3f8b8c11f11ffcb2cf4d6a9b669a46147c0db437656b7c42a8098c99fb4ad7ced651b64be0aee78eab62e625be1b8fbac894521cc',
//
//    codeVerifier: 'ZxdT4pXVo1hNuk6CtcK7NAu_dBjsiiVUDOo01Ap_-A8HUcmnRKg4mG4R19pdshGy',
//
//    splitPermissionList: {
//      optional: {
//        'r:auth:emailAddress': false,
//        'rw:auth:backupEmailAddress': false,
//        'rw:sample_localhost:file': false,
//      },
//      required: {
//        'r:auth:userName': true,
//        'r:sample_localhost:serviceUserId': true,
//        'rw:sample_localhost:notification': true,
//      },
//    },
//
//    _dummyCode: '$$_CODE_$$',
    clientId: 'sample_localhost',
    owner: 'sample_localhost',
    accessToken: 'HREQxaXKQCvI4pMOJ4MA209-rQXbS0gr1sl4ENAdPLK5iAEHKWCrpHFy_jMJ8Qgt',
    jsonPath: '/profile/readme.txt',
    content: 'this is a test content!',
  }

  const TEST_PARAM = {
    clientId: TEST_PARAM_COMMON.clientId,
    owner: TEST_PARAM_COMMON.owner,
    accessToken: TEST_PARAM_COMMON.accessToken,
    jsonPath: TEST_PARAM_COMMON.jsonPath,
    content: TEST_PARAM_COMMON.content,
//    // handleConnect
//    user: { emailAddress: TEST_PARAM_COMMON.emailAddress, userName: TEST_PARAM_COMMON.userName, },
//    clientId: TEST_PARAM_COMMON.clientId,
//    redirectUri: TEST_PARAM_COMMON.redirectUri,
//    state: TEST_PARAM_COMMON.state,
//    scope: TEST_PARAM_COMMON.scope,
//    responseType: TEST_PARAM_COMMON.responseType,
//    codeChallenge: TEST_PARAM_COMMON.codeChallenge,
//    codeChallengeMethod: TEST_PARAM_COMMON.codeChallengeMethod,
//    requestScope: TEST_PARAM_COMMON.requestScope,
//
//    // handleCredentialCheck
//    emailAddress: TEST_PARAM_COMMON.emailAddress,
//    passHmac2: TEST_PARAM_COMMON.passHmac2,
//
//    // handleCredentialCheck, handleConfirm
//    authSession: {
//      oidc: {
//        clientId: TEST_PARAM_COMMON.clientId,
//        state: TEST_PARAM_COMMON.state,
//        scope: TEST_PARAM_COMMON.scope,
//        responseType: TEST_PARAM_COMMON.responseType,
//        codeChallenge: TEST_PARAM_COMMON.codeChallenge,
//        codeChallengeMethod: TEST_PARAM_COMMON.codeChallengeMethod,
//        redirectUri: TEST_PARAM_COMMON.redirectUri,
//        requestScope: TEST_PARAM_COMMON.requestScope,
//        condition: null
//      }
//    },
//
//    // handleConfirm
//    ipAddress: '192.168.1.XYZ',
//    useragent: { browser: 'Godzilla', platform: 'xlogin' },
//    permissionList: {
//      'r:sample_localhost:serviceUserId': true,
//      'rw:sample_localhost:notification': true,
//      'r:auth:userName': true,
//      'rw:auth:backupEmailAddress': false,
//      'rw:sample_localhost:file': false,
//      'r:auth:emailAddress': false
//    },
//
//    // handleCode
//    codeVerifier: TEST_PARAM_COMMON.codeVerifier,
//
  }

  const EXPECTED_PARAM = {
    content: TEST_PARAM_COMMON.content,
//    splitPermissionList: TEST_PARAM_COMMON.splitPermissionList
  }

  /**
   * testId: C1010 
   * function: handleJsonUpdate
   */
  test('C1010 handleJsonUpdate', async () => {
    const expected = {
      status: 1,
      session: null,
      response: { result: { updateJsonResult: true } },
      redirect: null,
    }

    const paramKeyList = [
      'clientId',
      'accessToken',
      'owner',
      'jsonPath',
      'content',
    ]

    const argList = {}
    paramKeyList.forEach((key) => {
      argList[key] = TEST_PARAM[key]
    })

    const handleResult = await core.handleJsonUpdate(argList)
    console.log('handleJsonUpdate:', handleResult)

    expect(handleResult).toHaveProperty('status', expected.status)
    expect(handleResult).toHaveProperty('session', expected.session)

    expect(handleResult).toHaveProperty('response', expected.response)
    expect(handleResult.response).toEqual(expected.response)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)

  })


  /**
   * testId: C1021 
   * function: handleJsonContent
   */
  test('C1021 handleJsonContent', async () => {
    const expected = {
      status: 1,
      session: null,
      response: { result: { jsonContent: EXPECTED_PARAM.content } },
      redirect: null,
    }

    const paramKeyList = [
      'clientId',
      'accessToken',
      'owner',
      'jsonPath',
    ]

    const argList = {}
    paramKeyList.forEach((key) => {
      argList[key] = TEST_PARAM[key]
    })

    console.log({ argList })
    const handleResult = await core.handleJsonContent(argList)
    console.log('handleJsonContent:', handleResult)

    expect(handleResult).toHaveProperty('status', expected.status)
    expect(handleResult).toHaveProperty('session', expected.session)

    expect(handleResult).toHaveProperty('response', expected.response)
    expect(handleResult.response).toEqual(expected.response)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)

  })

})

afterAll(async () => {
  await init.end()
})

