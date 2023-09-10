export const handleConnect = ({ core, TEST_PARAM, EXPECTED_PARAM }) => {
  return async () => {
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
  }
}


