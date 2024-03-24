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
  awaitSleep,
}

