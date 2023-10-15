export const handleJsonContent = ({ core, TEST_PARAM, EXPECTED_PARAM }) => {
  return async () => {
    const expected = {
      status: 1,
      session: null,
      response: { result: { jsonContent: EXPECTED_PARAM.content } },
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

    console.log({ argList })
    const handleResult = await core.handleJsonContent(argList)
    console.log('handleJsonContent:', handleResult)

    expect(handleResult).toHaveProperty('status', expected.status)
    expect(handleResult).toHaveProperty('session', expected.session)

    expect(handleResult).toHaveProperty('response', expected.response)
    expect(handleResult.response).toEqual(expected.response)
    expect(handleResult).toHaveProperty('redirect', expected.redirect)

  }
}

