export const handleConfirm = ({ debugLog, core, TEST_PARAM, EXPECTED_PARAM }) => {
  return async () => {
    const expected = {
      status: 1,
      session: EXPECTED_PARAM.session,
      response: { redirect: `http://127.0.0.1:3001/f/xlogin/callback?state=${EXPECTED_PARAM.state}&code=${EXPECTED_PARAM._dummyCode}&iss=${EXPECTED_PARAM.iss}` },
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
    if (debugLog) {
      logger.debug('handleConfirm', handleResult)
    }

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
    expected.response.redirect = expected.response.redirect.replace(EXPECTED_PARAM._dummyCode, TEST_PARAM.code)

    expect(handleResult).toHaveProperty('session.user', expected.session.user)
    expect(handleResult.session.user).toEqual(expected.session.user)

    expect(handleResult).toHaveProperty('response', expected.response)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)
  }
}

