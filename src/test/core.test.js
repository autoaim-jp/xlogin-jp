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
    emailAddress: 'user@example.com',
    userName: 'test user',
    clientId: 'sample_localhost',
    redirectUri: 'http://127.0.0.1:3001/f/xlogin/callback',
    state: 'VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6',
    scope: 'r:auth:emailAddress,rw:auth:backupEmailAddress,*r:auth:userName,*r:sample_localhost:serviceUserId,*rw:sample_localhost:notification,rw:sample_localhost:file',
    responseType: 'code',
    codeChallenge: 'O-7bvwRh5ZevD4MyZ-bcee3NbxH8ddyNvNLl4t-kaLE',
    codeChallengeMethod: 'S256',
    requestScope: '',
    passHmac2: 'de9c2c84cc67f30892d2f6f3f8b8c11f11ffcb2cf4d6a9b669a46147c0db437656b7c42a8098c99fb4ad7ced651b64be0aee78eab62e625be1b8fbac894521cc',

    codeVerifier: 'ZxdT4pXVo1hNuk6CtcK7NAu_dBjsiiVUDOo01Ap_-A8HUcmnRKg4mG4R19pdshGy',

    splitPermissionList: {
      optional: {
        'r:auth:emailAddress': false,
        'rw:auth:backupEmailAddress': false,
        'rw:sample_localhost:file': false,
      },
      required: {
        'r:auth:userName': true,
        'r:sample_localhost:serviceUserId': true,
        'rw:sample_localhost:notification': true,
      },
    },

    _dummyCode: '$$_CODE_$$',
  }

  const TEST_PARAM = {
    // handleConnect
    user: { emailAddress: TEST_PARAM_COMMON.emailAddress, userName: TEST_PARAM_COMMON.userName, },
    clientId: TEST_PARAM_COMMON.clientId,
    redirectUri: TEST_PARAM_COMMON.redirectUri,
    state: TEST_PARAM_COMMON.state,
    scope: TEST_PARAM_COMMON.scope,
    responseType: TEST_PARAM_COMMON.responseType,
    codeChallenge: TEST_PARAM_COMMON.codeChallenge,
    codeChallengeMethod: TEST_PARAM_COMMON.codeChallengeMethod,
    requestScope: TEST_PARAM_COMMON.requestScope,

    // handleCredentialCheck
    emailAddress: TEST_PARAM_COMMON.emailAddress,
    passHmac2: TEST_PARAM_COMMON.passHmac2,

    // handleCredentialCheck, handleConfirm
    authSession: {
      oidc: {
        clientId: TEST_PARAM_COMMON.clientId,
        state: TEST_PARAM_COMMON.state,
        scope: TEST_PARAM_COMMON.scope,
        responseType: TEST_PARAM_COMMON.responseType,
        codeChallenge: TEST_PARAM_COMMON.codeChallenge,
        codeChallengeMethod: TEST_PARAM_COMMON.codeChallengeMethod,
        redirectUri: TEST_PARAM_COMMON.redirectUri,
        requestScope: TEST_PARAM_COMMON.requestScope,
        condition: null
      }
    },

    // handleConfirm
    ipAddress: '192.168.1.XYZ',
    useragent: { browser: 'Godzilla', platform: 'xlogin' },
    permissionList: {
      'r:sample_localhost:serviceUserId': true,
      'rw:sample_localhost:notification': true,
      'r:auth:userName': true,
      'rw:auth:backupEmailAddress': false,
      'rw:sample_localhost:file': false,
      'r:auth:emailAddress': false
    },

    // handleCode
    codeVerifier: TEST_PARAM_COMMON.codeVerifier,

  }

  const EXPECTED_PARAM = {
    session: {
      oidc: {
        clientId: TEST_PARAM.clientId,
        state: TEST_PARAM.state,
        scope: TEST_PARAM.scope,
        responseType: TEST_PARAM.responseType,
        codeChallenge: TEST_PARAM.codeChallenge,
        codeChallengeMethod: TEST_PARAM.codeChallengeMethod,
        redirectUri: TEST_PARAM.redirectUri,
        requestScope: TEST_PARAM.requestScope,
        condition: undefined,
      },
      user: TEST_PARAM.user
    },

    splitPermissionList: TEST_PARAM_COMMON.splitPermissionList
  }

  /**
   * testId: A1000-3,A1000-4
   * function: handleConnect
   */
  test('A1000-3,A1000-4 handleConnect', async () => {
    const expected = {
      status: 1,
      session: EXPECTED_PARAM.session,
      response: null,
      redirect: '/confirm'
    }

    const paramKeyList = [
      'user',
      'clientId',
      'redirectUri',
      'state',
      'scope',
      'responseType',
      'codeChallenge',
      'codeChallengeMethod',
      'requestScope',
    ]

    const argList = {}
    paramKeyList.forEach((key) => {
      argList[key] = TEST_PARAM[key]
    })

    const handleResult = await core.handleConnect(argList)
    console.log('handleConnect:',handleResult)

    expect(handleResult).toHaveProperty('status', expected.status)

    expect(handleResult).toHaveProperty('session')
    expect(handleResult).toHaveProperty('session.oidc')
    expect(handleResult).toHaveProperty('session.oidc.clientId', expected.session.oidc.clientId)
    expect(handleResult).toHaveProperty('session.oidc.state', expected.session.oidc.state)
    expect(handleResult).toHaveProperty('session.oidc.scope', expected.session.oidc.scope)
    expect(handleResult).toHaveProperty('session.oidc.responseType', expected.session.oidc.responseType)
    expect(handleResult).toHaveProperty('session.oidc.codeChallenge', expected.session.oidc.codeChallenge)
    expect(handleResult).toHaveProperty('session.oidc.codeChallengeMethod', expected.session.oidc.codeChallengeMethod)
    expect(handleResult).toHaveProperty('session.oidc.redirectUri', expected.session.oidc.redirectUri)
    expect(handleResult).toHaveProperty('session.oidc.requestScope', expected.session.oidc.requestScope)
    expect(handleResult).toHaveProperty('session.oidc.condition', 'confirm')

    expect(handleResult).toHaveProperty('session.user', expected.session.user)
    expect(handleResult.session.user).toEqual(expected.session.user)

    expect(handleResult).toHaveProperty('response', expected.response)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)
  }, 10 * 1000)

  test('A3000-3 handleUserAdd', () => {
  })

  /*
test('handleThrough', () => {
    const argList = {
      ipAddress: '::ffff:172.26.0.1',
      useragent: { browser: 'Godzilla', platform: 'xlogin' },
      authSession: SESSION_OBJ,
    }
    const handleResult = await core.handleThrough(argList)

    const expectedPart = {
      status: 1,
      session: {
        code: 'giuQxKxMNwojfA4zPbAZgHAigA_kA-FmlIoBtU8ur7Sqcrv6e5FDdPL7IG1jqPyf',
        splitPermissionList:{
          required: {
            'r:auth:userName': true,
            'r:sample_localhost:serviceUserId': true,
            'rw:sample_localhost:notification': true
          },
          optional: {}
        }
      },
      response: {
        result: {
          oldPermissionList: null,
          requestScope: '',
        },
      },
    }
    const expected = Object.assign({}, { session: SESSION_OBJ }, expectedPart)

    console.log({ handleResult, expected })

  // TODO
    expect(handleResult.response).toEqual(expected.response)
})

*/


  /**
   * testId: A3000-2
   * function: handleCredentialCheck
   */
  test('A3000-2 handleCredentialCheck', async () => {
    const expected = {
      status: 1,
      session: EXPECTED_PARAM.session,
      response: { redirect: '/confirm' },
      redirect: null,
    }

    const paramKeyList = [
      'emailAddress',
      'passHmac2',
      'authSession',
    ]

    const argList = {}
    paramKeyList.forEach((key) => {
      argList[key] = TEST_PARAM[key]
    })

    const handleResult = await core.handleCredentialCheck(argList)
    console.log('handleCredentialCheck:', handleResult)

    expect(handleResult).toHaveProperty('status', expected.status)

    expect(handleResult).toHaveProperty('session')
    expect(handleResult).toHaveProperty('session.oidc')
    expect(handleResult).toHaveProperty('session.oidc.clientId', expected.session.oidc.clientId)
    expect(handleResult).toHaveProperty('session.oidc.state', expected.session.oidc.state)
    expect(handleResult).toHaveProperty('session.oidc.scope', expected.session.oidc.scope)
    expect(handleResult).toHaveProperty('session.oidc.responseType', expected.session.oidc.responseType)
    expect(handleResult).toHaveProperty('session.oidc.codeChallenge', expected.session.oidc.codeChallenge)
    expect(handleResult).toHaveProperty('session.oidc.codeChallengeMethod', expected.session.oidc.codeChallengeMethod)
    expect(handleResult).toHaveProperty('session.oidc.redirectUri', expected.session.oidc.redirectUri)
    expect(handleResult).toHaveProperty('session.oidc.requestScope', expected.session.oidc.requestScope)
    expect(handleResult).toHaveProperty('session.oidc.condition', 'confirm')

    expect(handleResult).toHaveProperty('session.user', expected.session.user)
    expect(handleResult.session.user).toEqual(expected.session.user)

    expect(handleResult).toHaveProperty('response', expected.response)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)

  })

  /**
   * testId: A4000-1
   * function: handleConfirm
   */
  test('A4000-1 handleConfirm', async () => {
    const expected = {
      status: 1,
      session: EXPECTED_PARAM.session,
      response: { redirect: `http://127.0.0.1:3001/f/xlogin/callback?state=VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6&code=${TEST_PARAM._dummyCode}&iss=http://localhost:3000` },
      redirect: null,
    }
    expected.session.oidc.splitPermissionList = EXPECTED_PARAM.splitPermissionList

    const paramKeyList = [
      'ipAddress',
      'useragent',
      'permissionList',
      'authSession',
    ]

    const argList = {}
    paramKeyList.forEach((key) => {
      argList[key] = TEST_PARAM[key]
    })

    const handleResult = await core.handleConfirm(argList)
    console.log('handleConfirm:', handleResult)

    expect(handleResult).toHaveProperty('status', expected.status)

    expect(handleResult).toHaveProperty('session')
    expect(handleResult).toHaveProperty('session.oidc')
    expect(handleResult).toHaveProperty('session.oidc.clientId', expected.session.oidc.clientId)
    expect(handleResult).toHaveProperty('session.oidc.state', expected.session.oidc.state)
    expect(handleResult).toHaveProperty('session.oidc.scope', expected.session.oidc.scope)
    expect(handleResult).toHaveProperty('session.oidc.responseType', expected.session.oidc.responseType)
    expect(handleResult).toHaveProperty('session.oidc.codeChallenge', expected.session.oidc.codeChallenge)
    expect(handleResult).toHaveProperty('session.oidc.codeChallengeMethod', expected.session.oidc.codeChallengeMethod)
    expect(handleResult).toHaveProperty('session.oidc.redirectUri', expected.session.oidc.redirectUri)
    expect(handleResult).toHaveProperty('session.oidc.requestScope', expected.session.oidc.requestScope)
    expect(handleResult).toHaveProperty('session.oidc.splitPermissionList', expected.session.oidc.splitPermissionList)

    expect(handleResult).toHaveProperty('session.oidc.condition', 'code')

    expect(handleResult).toHaveProperty('session.oidc.code')
    TEST_PARAM.code = handleResult.session.oidc.code
    expected.response.redirect = expected.response.redirect.replace(TEST_PARAM._dummyCode, TEST_PARAM.code)

    expect(handleResult).toHaveProperty('session.user', expected.session.user)
    expect(handleResult.session.user).toEqual(expected.session.user)

    expect(handleResult).toHaveProperty('response', expected.response)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)
  })

  /**
   * testId: A5000-2
   * function: handleCode
   */
  test('A5000-2 handleCode', async () => {
    const expected = {
      status: 1,
      session: { condition: 'user_info', },
      response: { result: { accessToken: '', splitPermissionList: EXPECTED_PARAM.splitPermissionList } },
      redirect: null,
    }

    const paramKeyList = [
      'clientId',
      'code',
      'codeVerifier',
    ]

    const argList = {}
    paramKeyList.forEach((key) => {
      argList[key] = TEST_PARAM[key]
    })

    const handleResult = await core.handleCode(argList)
    console.log('handleCode:', handleResult)

    expect(handleResult).toHaveProperty('status', expected.status)

    expect(handleResult).toHaveProperty('session')
    expect(handleResult.session).toEqual(expected.session)

    expect(handleResult).toHaveProperty('response')
    expect(handleResult).toHaveProperty('response.result')
    expect(handleResult).toHaveProperty('response.result.accessToken')
    TEST_PARAM.accessToken = handleResult.response.result.accessToken
    expect(handleResult).toHaveProperty('response.result.splitPermissionList', expected.response.result.splitPermissionList)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)
  })

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

afterAll(async () => {
  await init.end()
})

