const createAmqpConnection = async ({
  amqplib, user, pass, host, port,
}) => {
  const conn = await amqplib.connect(`amqp://${user}:${pass}@${host}:${port}`)
  return conn
}

const fork = ({ spawn, commandList, resultList, }) => {
  return new Promise((resolve) => {
    const proc = spawn(commandList[0], commandList.slice(1), { shell: true })

    proc.stderr.on('data', (err) => {
      // console.error('stderr:', err.toString())
    })
    proc.stdout.on('data', (data) => {
      // console.log('stdout:', data.toString())
      const result = ((data || '').toString() || '')
      resultList.push(result)
    })
    proc.on('close', (code) => {
      // console.log('[end] spawn', code)
      resolve()
    })
  })
}

const awaitSleep = ({ ms }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export default {
  createAmqpConnection,
	fork,
  awaitSleep,
}

