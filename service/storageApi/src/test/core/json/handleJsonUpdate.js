export const handleJsonUpdate = ({ core, TEST_PARAM, EXPECTED_PARAM }) => {
  return async () => {
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
  }
}

