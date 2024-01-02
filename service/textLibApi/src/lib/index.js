import backendServerLib from './backendServerLib.js'
/**
 * @file
 * @name アプリケーション全体で共通で使用するライブラリ
 * @memberof lib
 */
const mod = {}

/**
 * init.
 *
 * @param {} crypto
 * @param {} ulid
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const init = ({ crypto, ulid, winston }) => {
  mod.crypto = crypto
  mod.ulid = ulid
  mod.winston = winston
  backendServerLib.init({ crypto, ulid })
}


const createAmqpConnection = async ({
  amqplib, user, pass, host, port,
}) => {
  const conn = await amqplib.connect(`amqp://${user}:${pass}@${host}:${port}`)
  return conn
}

const getUlid = () => {
  return mod.ulid()
}

const awaitSleep = ({ ms }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const createGlobalLogger = ({ SERVICE_NAME }) => {
  const logger = mod.winston.createLogger({
    level: 'info',
    format: mod.winston.format.json(),
    defaultMeta: { service: SERVICE_NAME },
    transports: [
      new mod.winston.transports.Console({ level: 'debug' }),
      new mod.winston.transports.File({ filename: 'log/combined.log', level: 'info' }),
    ],
  })
  global.logger = logger
}

export default {
  backendServerLib,
  init,
  createAmqpConnection,
  getUlid,
  awaitSleep,
  createGlobalLogger,
}

