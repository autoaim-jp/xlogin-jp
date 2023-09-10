export const handleThrough = ({ core, TEST_PARAM, EXPECTED_PARAM }) => {
  return async () => {
    const expected = {
      status: 1200,
      session: EXPECTED_PARAM.session,
      response: { result: { oldPermissionList: null, requestScope: TEST_PARAM.requestScope } },
      redirect: null,
    }

    const argList = {
      ipAddress: '::ffff:172.26.0.1',
      useragent: { browser: 'Godzilla', platform: 'xlogin' },
      authSession: TEST_PARAM.authSession,
    }
    const handleResult = await core.handleThrough(argList)
    console.log('handleThrough:', handleResult)

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

  }
}

