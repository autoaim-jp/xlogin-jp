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
const init = ({
  crypto, ulid, winston, multer,
}) => {
  mod.crypto = crypto
  mod.ulid = ulid
  mod.multer = multer
  backendServerLib.init({ crypto, ulid, winston })
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

const parseMultipartFileUpload = ({ req, formKey }) => {
  const upload = mod.multer({
    storage: mod.multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
  })

  return new Promise((resolve) => {
    upload.single(formKey)(req, null, (error) => {
      if (error instanceof mod.multer.MulterError) {
        return resolve({ error: true, message: error.message })
      } if (error) {
        return resolve({ error: true, message: 'unkown error' })
      }

      return resolve({ error: false, message: 'success' })
    })
  })
}


export default {
  backendServerLib,
  init,
  createAmqpConnection,
  getUlid,
  parseMultipartFileUpload,
}

