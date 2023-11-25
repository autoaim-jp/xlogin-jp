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
const init = ({ crypto, ulid }) => {
  mod.crypto = crypto
  mod.ulid = ulid
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

export default {
  backendServerLib,
  init,
  createAmqpConnection,
  getUlid,
}

