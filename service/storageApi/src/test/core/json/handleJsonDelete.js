export const handleJsonDelete = ({ core, TEST_PARAM, EXPECTED_PARAM }) => {
  return async () => {
    const expected = {
      status: 1,
      session: null,
      response: { result: { deleteJsonResult: true } },
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

    const handleResult = await core.handleJsonDelete(argList)
    console.log('handleJsonDelete:', handleResult)

    expect(handleResult).toHaveProperty('status', expected.status)
    expect(handleResult).toHaveProperty('session', expected.session)

    expect(handleResult).toHaveProperty('response', expected.response)
    expect(handleResult.response).toEqual(expected.response)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)
  }
}

