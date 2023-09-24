/* /lib/index.js */
import commonServerLib from './commonServerLib.js'
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
 * @param {} multer
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const init = ({ crypto, ulid, multer }) => {
  mod.crypto = crypto
  mod.ulid = ulid
  mod.multer = multer
  commonServerLib.init({ crypto, ulid })
}

/**
 * setPgPool.
 *
 * @param {} pgPool
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const setPgPool = ({ pgPool }) => {
  mod.pgPool = pgPool
}

/**
 * closePgPool.
 *
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const closePgPool = async () => {
  await mod.pgPool.end()
}

/* date */
/**
 * formatDate.
 *
 * @param {} format
 * @param {} date
 * @return {string} フォーマットした時刻
 * @memberof lib
 */
const formatDate = (format = 'YYYY-MM-DD hh:mm:ss', date = new Date()) => {
  return format.replace(/YYYY/g, date.getFullYear())
    .replace(/MM/g, (`0${date.getMonth() + 1}`).slice(-2))
    .replace(/DD/g, (`0${date.getDate()}`).slice(-2))
    .replace(/hh/g, (`0${date.getHours()}`).slice(-2))
    .replace(/mm/g, (`0${date.getMinutes()}`).slice(-2))
    .replace(/ss/g, (`0${date.getSeconds()}`).slice(-2))
}

/**
 * awaitSleep.
 *
 * @param {} ms
 * @return {Promise()} Promise内の戻り値なし
 * @memberof lib
 */
const awaitSleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}


/* db */
/**
 * execQuery.
 *
 * @param {} query
 * @param {} paramList
 * @return {Promise(object)} DBアクセスの結果とエラー
 * @memberof lib
 */
const execQuery = async (query, paramList = []) => {
  return new Promise((resolve) => {
    mod.pgPool
      .query(query, paramList)
      .then((result) => {
        return resolve({ err: null, result })
      })
      .catch((err) => {
        console.error('Error executing query', err.stack)
        return resolve({ err, result: null })
      })
  })
}

const parseMultipartFileUpload = (req, formKey) => {
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
  commonServerLib,

  init,
  setPgPool,
  closePgPool,

  formatDate,
  awaitSleep,

  parseMultipartFileUpload,

  execQuery,
}

