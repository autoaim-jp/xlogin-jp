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

const _execTesseract = async ({ pngImgBase64 }) => {
  const taskTmpDirName = mod.lib.backendServerLib.getUlid()
  const imageFileName = mod.lib.backendServerLib.getUlid() + '.png'
  const base64Str = pngImgBase64.replace('data:image/png;base64,', '')
  mod.output.writeFileBase64({ filePath: `/home/work/${imageFileName}`, content: base64Str })

  const commandList = ['mkdir', '-p', `/home/work/${taskTmpDirName}/out/`, '&&', 'cd', `/home/work/${TASK_TMP_DIR}/out/`, '&&', 'tesseract', `../${imageFileName}`, 'phototest', '-l', 'jpn', '--psm', '1', '--oem', '3', 'txt', 'pdf', 'hocr']
  const resultList = []
  await lib.fork({ commandList, resultList })

  const resultTextFilePath = `/home/work/${taskTmpDirName}/out/phototest.txt`
  const resultText = mod.init.readFileContent({ filePath: resultTextFilePath })
  const responseObj = { resultText }

  return responseObj
}


const startConsumer = async () => {
  const promptQueue = mod.setting.getValue('amqp.CHATGPT_PROMPT_QUEUE')
  await mod.amqpPromptChannel.assertQueue(promptQueue)

  const responseQueue = mod.setting.getValue('amqp.CHATGPT_RESPONSE_QUEUE')
  await mod.amqpResponseChannel.assertQueue(responseQueue)

  mod.amqpPromptChannel.consume(promptQueue, async (msg) => {
    if (msg !== null) {
      const SLEEP_BEFORE_REQUEST_MS = mod.setting.getValue('chatgpt.SLEEP_BEFORE_REQUEST_MS')
      console.log(`sleep ${SLEEP_BEFORE_REQUEST_MS}s`)
      await mod.lib.awaitSleep({ ms: SLEEP_BEFORE_REQUEST_MS })

      const requestJson = JSON.parse(msg.content.toString())

      const { requestId, pngImgBase64 } = requestJson

      const responseObj = await _execTesseract({ pngImgBase64 })
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

