const mod = {}

const init = async ({
  setting, output, input, lib, amqpConnection,
}) => {
  const amqpPromptChannel = await amqpConnection.createChannel()
  mod.amqpPromptChannel = amqpPromptChannel
  const amqpResponseChannel = await amqpConnection.createChannel()
  mod.amqpResponseChannel = amqpResponseChannel

  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}

const _execTesseract = async ({ imgBase64 }) => {
  const workDirName = mod.lib.backendServerLib.getUlid()
  const workDirPath = `/app/data/${workDirName}/`
  const imageFileName = mod.lib.backendServerLib.getUlid()
  const imageFilePath = `${workDirPath}${imageFileName}`

  mod.output.makeDir({ dirPath: workDirPath })
  mod.output.writeFileBase64({ filePath: imageFilePath, content: imgBase64 })

  const commandList = ['cd', workDirPath, '&&', 'tesseract', imageFilePath, 'result', '-l', 'jpn', '--psm', '1', '--oem', '3', 'txt', 'pdf', 'hocr']
  const resultList = []
  await mod.lib.fork({ commandList, resultList })

  const resultTextFilePath = `${workDirPath}result.txt`
  const resultText = mod.input.readFileContent({ filePath: resultTextFilePath })
  const responseObj = { resultText }

  console.log({ debug: true, resultText })

  return responseObj
}


const startConsumer = async () => {
  const requestQueue = mod.setting.getValue('amqp.TESSERACT_REQUEST_QUEUE')
  await mod.amqpPromptChannel.assertQueue(requestQueue)

  const responseQueue = mod.setting.getValue('amqp.TESSERACT_RESPONSE_QUEUE')
  await mod.amqpResponseChannel.assertQueue(responseQueue)

  mod.amqpPromptChannel.consume(requestQueue, async (msg) => {
    if (msg !== null) {
      const requestJson = JSON.parse(msg.content.toString())

      const { requestId, imgBase64 } = requestJson

      const responseObj = await _execTesseract({ imgBase64 })
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

