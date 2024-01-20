import backendServerLib from './backendServerLib.js'

const init = ({ winston }) => {
  backendServerLib.init({ winston })
}

const createAmqpConnection = async ({
  amqplib, user, pass, host, port,
}) => {
  const conn = await amqplib.connect(`amqp://${user}:${pass}@${host}:${port}`)
  return conn
}

const fork = ({ spawn, commandList, resultList }) => {
  return new Promise((resolve) => {
    const proc = spawn(commandList[0], commandList.slice(1), { shell: true })

    proc.stderr.on('data', (err) => {
      logger.error('fork', err.toString())
    })
    proc.stdout.on('data', (data) => {
      logger.info('fork', data.toString())
      const result = ((data || '').toString() || '')
      resultList.push(result)
    })
    proc.on('close', (code) => {
      logger.info('spawn', code)
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
  backendServerLib,

  init,

  createAmqpConnection,
  fork,
  awaitSleep,
}

