export const handleUserInfo = ({ debugLog, core, TEST_PARAM, EXPECTED_PARAM }) => {
  return async () => {
    const expectedNotificationKey = `${EXPECTED_PARAM.clientId}:notification`
    const expectedServiceUserIdKey = `${EXPECTED_PARAM.clientId}:serviceUserId`

    const expected = {
      status: 1,
      session: null,
      response: {
        result: {
          userInfo: {
            public: {
              'auth:userName': EXPECTED_PARAM.userName,
              // [expectedServiceUserIdKey]: serviceUserId,
              [expectedNotificationKey]: null,
            }
          },
        }
      },

      redirect: null,
    }

    const paramKeyList = [
      'clientId',
      'accessToken',
      'filterKeyListStr',
    ]

    const argList = {}
    paramKeyList.forEach((key) => {
      argList[key] = TEST_PARAM[key]
    })

    const handleResult = await core.handleUserInfo(argList)
    if (debugLog) {
      console.log('handleUserInfo:', handleResult)
    }

    expect(handleResult).toHaveProperty('status', expected.status)

    expect(handleResult).toHaveProperty('session')
    expect(handleResult.session).toEqual(expected.session)

    expect(handleResult).toHaveProperty('response')
    expect(handleResult).toHaveProperty('response.result')
    expect(handleResult).toHaveProperty('response.result.userInfo')
    expect(handleResult).toHaveProperty('response.result.userInfo.public')
    expect(handleResult.response.result.userInfo.public).toHaveProperty('auth:userName')
    expect(handleResult.response.result.userInfo.public).toHaveProperty(expectedServiceUserIdKey)
    expect(handleResult.response.result.userInfo.public).toHaveProperty(expectedNotificationKey)
    expect(handleResult.response.result.userInfo.public['auth:userName']).toEqual(expected.response.result.userInfo.public['auth:userName'])
    expect(handleResult.response.result.userInfo.public[expectedNotificationKey]).toEqual(expected.response.result.userInfo.public[expectedNotificationKey])
    TEST_PARAM.serviceUserId = handleResult.response.result.userInfo.public[expectedServiceUserIdKey]
    expect(handleResult).toHaveProperty('redirect', expected.redirect)
  }
}

