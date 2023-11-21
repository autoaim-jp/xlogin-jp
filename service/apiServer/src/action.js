const getHandlerRegisterPrompt = ({ handleRegisterPrompt }) => {
  return async (req, res) => {
    const { prompt } = req.body
    console.log({ debug: true, request: 'ok!', prompt })

    const handleResult = await handleRegisterPrompt({ prompt })

    res.json({ result: handleResult })
  }
}

const getHandlerLookupChatgptResponse = ({ handleLookupChatgptResponse }) => {
  return async (req, res) => {
    const { requestId } = req.query

    const handleResult = handleLookupChatgptResponse({ requestId })

    res.json({ result: handleResult })
  }
}

export default {
  getHandlerRegisterPrompt,
  getHandlerLookupChatgptResponse,
}


