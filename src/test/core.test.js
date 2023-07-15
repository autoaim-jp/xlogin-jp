import init from './init.js'
import core from '../core.js'

beforeAll(async () => {
  jest.spyOn(console, 'error').mockImplementation()
  await init.init()
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
    // console.log(handleResult)
    const expected = {
      status: 1,
      session: {
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
      },
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

describe('handleThrough', () => {
  it('expect: success', async() => {
    const handleResult = await handleThrough(ipAddress, useragent, authSession)
  })
})

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

