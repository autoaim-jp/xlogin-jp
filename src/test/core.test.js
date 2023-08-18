import init from './init.js'
import core from '../core.js'
import ulid from 'ulid'

const SESSION_OBJ = {
  oidc: {
    clientId: 'sample_localhost',
    state: 'VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6',
    scope: 'r:auth:emailAddress,rw:auth:backupEmailAddress,*r:auth:userName,*r:sample_localhost:serviceUserId,*rw:sample_localhost:notification,rw:sample_localhost:file',
    responseType: 'code',
    codeChallenge: 'nwLPNMJjIHImHr86HS9HSL_RA-Rr49s-Ii9YSeKKRLc',
    codeChallengeMethod: 'S256',
    redirectUri: 'http://127.0.0.1:3001/f/xlogin/callback',
    requestScope: '',
    condition: 'confirm'
  },
  user: { emailAddress: 'user@example.com', userName: 'no name' }
}

beforeAll(async () => {
  jest.spyOn(console, 'error').mockImplementation()
  await init.init()
  await init.insertTestData()
}, 30 * 1000)

describe('handleConnect', () => {
  it('expect: success', async () => {
    const argList = {
      user: { emailAddress: 'user@example.com', userName: 'no name' },
      clientId: 'sample_localhost',
      redirectUri: 'http://127.0.0.1:3001/f/xlogin/callback',
      state: 'VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6',
      scope: 'r:auth:emailAddress,rw:auth:backupEmailAddress,*r:auth:userName,*r:sample_localhost:serviceUserId,*rw:sample_localhost:notification,rw:sample_localhost:file',
      responseType: 'code',
      codeChallenge: 'nwLPNMJjIHImHr86HS9HSL_RA-Rr49s-Ii9YSeKKRLc',
      codeChallengeMethod: 'S256',
      requestScope: ''
    }
    const handleResult = await core.handleConnect(argList)
    console.log('handleConnect:', handleResult)
    const expected = {
      status: 1,
      session: SESSION_OBJ,
      response: null,
      redirect: '/confirm'
    }

    expect(handleResult).toHaveProperty('status', 1)

    expect(handleResult).toHaveProperty('session')
    expect(handleResult).toHaveProperty('session.oidc')
    expect(handleResult).toHaveProperty('session.oidc.clientId', argList.clientId)
    expect(handleResult).toHaveProperty('session.oidc.state', argList.state)
    expect(handleResult).toHaveProperty('session.oidc.scope', argList.scope)
    expect(handleResult).toHaveProperty('session.oidc.responseType', argList.responseType)
    expect(handleResult).toHaveProperty('session.oidc.codeChallenge', argList.codeChallenge)
    expect(handleResult).toHaveProperty('session.oidc.codeChallengeMethod', argList.codeChallengeMethod)
    expect(handleResult).toHaveProperty('session.oidc.redirectUri', argList.redirectUri)
    expect(handleResult).toHaveProperty('session.oidc.requestScope', argList.requestScope)
    expect(handleResult).toHaveProperty('session.oidc.condition', 'confirm')

    expect(handleResult).toHaveProperty('session.user')
    expect(handleResult.session.user).toEqual(argList.user)

    expect(handleResult).toHaveProperty('response', null)
    expect(handleResult).toHaveProperty('redirect')
  })
}, 10 * 1000)

/*
describe('handleThrough', () => {
  it('expect: success', async() => {
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
})

  */

describe('handleCredentialCheck', () => {
  it('expect: success', async () => {
    const argList = {
      emailAddress: 'user@example.com',
      passHmac2: 'de9c2c84cc67f30892d2f6f3f8b8c11f11ffcb2cf4d6a9b669a46147c0db437656b7c42a8098c99fb4ad7ced651b64be0aee78eab62e625be1b8fbac894521cc',
      authSession: {
        oidc: {
          clientId: 'sample_localhost',
          state: 'VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6',
          scope: 'r:auth:emailAddress,rw:auth:backupEmailAddress,*r:auth:userName,*r:sample_localhost:serviceUserId,*rw:sample_localhost:notification,rw:sample_localhost:file',
          responseType: 'code',
          codeChallenge: 'nwLPNMJjIHImHr86HS9HSL_RA-Rr49s-Ii9YSeKKRLc',
          codeChallengeMethod: 'S256',
          redirectUri: 'http://127.0.0.1:3001/f/xlogin/callback',
          requestScope: '',
          condition: 'login'
        }
      }
    }

    const handleResult = await core.handleCredentialCheck(argList)
    console.log('handleCredentialCheck:', handleResult)
  })
})

describe('handleConfirm', () => {
  it('expect: success', async () => {
    const argList = {
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
      authSession: {
        oidc: {
          clientId: 'sample_localhost',
          state: 'VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6',
          scope: 'r:auth:emailAddress,rw:auth:backupEmailAddress,*r:auth:userName,*r:sample_localhost:serviceUserId,*rw:sample_localhost:notification,rw:sample_localhost:file',
          responseType: 'code',
          codeChallenge: 'nwLPNMJjIHImHr86HS9HSL_RA-Rr49s-Ii9YSeKKRLc',
          codeChallengeMethod: 'S256',
          redirectUri: 'http://127.0.0.1:3001/f/xlogin/callback',
          requestScope: '',
          condition: 'confirm'
        },
        user: { emailAddress: 'user@example.com', userName: 'test user' }
      }
    }

    const handleResult = await core.handleConfirm(argList)
    console.log('handleConfirm:', handleResult)
  })
})

/*

describe('handleCode', () => {
  it('expect: success', async () => {
    const argList = {
      clientId: 'sample_localhost',
      redirectUri: 'http://127.0.0.1:3001/f/xlogin/callback',
      state: 'VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6',
      codeVerifier: ''
    }

    const handleResult = await core.handleCode(argList)
    console.log(handleResult)
  })
})

describe('handleUserInfo', () => {
  it('expect: success', async () => {
    const argList = {
      clientId: 'sample_localhost',
      accessToken: '2Upv9RxTrEoin-AvqBtrmGsm0E74guOB7VirKOgt2D3qLOIPR7G0UyUArBTU2rkk',
      filterKeyListStr: 'auth:emailAddress,auth:backupEmailAddress,auth:userName,sample_localhost:serviceUserId,sample_localhost:notification,sample_localhost:file',
    }

    const handleResult = await core.handleUserInfo(argList)
    console.log(handleResult)
  })
})
*/

afterAll(async () => {
  await init.end()
})

