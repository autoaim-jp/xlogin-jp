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
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const init = ({ crypto, ulid }) => {
  mod.crypto = crypto
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

/**
 * convertToCodeChallenge.
 *
 * @param {} codeVerifier
 * @param {} codeChallengeMethod
 * @return {string} 作成したcodeChallenge
 * @memberof lib
 */
const convertToCodeChallenge = (codeVerifier, codeChallengeMethod) => {
  /**
   * calcSha256AsB64Url.
   *
   * @param {} str
   */
  const calcSha256AsB64Url = (str) => {
    const sha256 = mod.crypto.createHash('sha256')
    sha256.update(str)
    return sha256.digest('base64url')
  }

  if (codeChallengeMethod === 'S256') {
    return calcSha256AsB64Url(codeVerifier)
  }
  throw new Error('unimplemented')
}

/**
 * calcPbkdf2.
 *
 * @param {} data
 * @param {} saltHex
 * @return {Promise(string)} 計算したPBKDF2
 * @memberof lib
 */
const calcPbkdf2 = (data, saltHex) => {
  return new Promise((resolve) => {
    mod.crypto.pbkdf2(data, Buffer.from(saltHex, 'hex'), 1000 * 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        return resolve(null)
      }
      return resolve(derivedKey.toString('hex'))
    })
  })
}

/**
 * getMaxIdInList.
 *
 * @param {} list
 * @return {string} リストの最大値
 * @memberof lib
 */
const getMaxIdInList = (list) => {
  return list.reduce((p, c) => {
    return p > c ? p : c
  })
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

export default {
  commonServerLib,

  init,
  setPgPool,
  closePgPool,

  convertToCodeChallenge,
  calcPbkdf2,
  getMaxIdInList,

  formatDate,
  awaitSleep,

  execQuery,
}

