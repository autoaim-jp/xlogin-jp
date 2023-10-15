/* /lib/index.js */
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
  backendServerLib.init({ crypto, ulid })
}

/**
 * convertToCodeChallenge.
 *
 * @param {} codeVerifier
 * @param {} codeChallengeMethod
 * @return {string} 作成したcodeChallenge
 * @memberof lib
 */
const convertToCodeChallenge = ({ codeVerifier, codeChallengeMethod }) => {
  /**
   * calcSha256AsB64Url.
   *
   * @param {} str
   */
  const calcSha256AsB64Url = ({ str }) => {
    const sha256 = mod.crypto.createHash('sha256')
    sha256.update(str)
    return sha256.digest('base64url')
  }

  if (codeChallengeMethod === 'S256') {
    return calcSha256AsB64Url({ str: codeVerifier })
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
const calcPbkdf2 = ({ data, saltHex }) => {
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
const getMaxIdInList = ({ list }) => {
  return list.reduce((p, c) => {
    return p > c ? p : c
  })
}

export default {
  backendServerLib,

  init,

  convertToCodeChallenge,
  calcPbkdf2,
  getMaxIdInList,
}

