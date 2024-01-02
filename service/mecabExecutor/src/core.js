const mod = {}

const init = async ({
  setting, lib, amqpConnection, mecab,
}) => {
  const amqpPromptChannel = await amqpConnection.createChannel()
  mod.amqpPromptChannel = amqpPromptChannel
  const amqpResponseChannel = await amqpConnection.createChannel()
  mod.amqpResponseChannel = amqpResponseChannel

  mod.setting = setting
  mod.lib = lib
	mod.mecab = mecab
}

const parseText = async ({ message }) => {
	const result = await new Promise((resolve) => {
		mod.mecab.parse(message, (err, parsedResult) => {
			resolve({ err, parsedResult })
		})
	})

	if (result.err || !result.parsedResult) {
		return { error: 'parse error' }
	}

	const responseObj = { parsedResult: result.parsedResult.join('\n') }
	return responseObj
}


const startConsumer = async () => {
	const promptQueue = mod.setting.getValue('amqp.MECAB_PROMPT_QUEUE')
	await mod.amqpPromptChannel.assertQueue(promptQueue)

	const responseQueue = mod.setting.getValue('amqp.MECAB_RESPONSE_QUEUE')
	await mod.amqpResponseChannel.assertQueue(responseQueue)

	mod.amqpPromptChannel.consume(promptQueue, async (msg) => {
		if (msg !== null) {
			const requestJson = JSON.parse(msg.content.toString())

			const { requestId } = requestJson
			const message = requestJson.message

			const responseObj = await parseText({ message })
			const responseJson = { requestId, response: responseObj }
			const responseJsonStr = JSON.stringify(responseJson)
			mod.amqpResponseChannel.sendToQueue(responseQueue, Buffer.from(responseJsonStr))

			mod.amqpPromptChannel.ack(msg)
		} else {
			// Consumer cancelled by server
			throw new Error()
		}
	})
}

export default {
	init,
	startConsumer,
}

