export const handleCode = ({ debugLog, core, TEST_PARAM, EXPECTED_PARAM }) => {
  return async () => {
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
    if (debugLog) {
      logger.debug('handleCode', handleResult)
    }

    expect(handleResult).toHaveProperty('status', expected.status)

    expect(handleResult).toHaveProperty('session')
    expect(handleResult.session).toEqual(expected.session)

    expect(handleResult).toHaveProperty('response')
    expect(handleResult).toHaveProperty('response.result')
    expect(handleResult).toHaveProperty('response.result.accessToken')
    TEST_PARAM.accessToken = handleResult.response.result.accessToken
    expect(handleResult).toHaveProperty('response.result.splitPermissionList', expected.response.result.splitPermissionList)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)
  }
}

