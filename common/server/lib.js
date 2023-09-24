/* /common/server/lib.js */
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
}

/* url */
/**
 * objToQuery.
 *
 * @param {} obj
 * @return {String} オブジェクトから作成したクエリストリング
 * @memberof lib
 */
const objToQuery = (obj) => {
  return Object.entries(obj).map(([key, value]) => { return `${key}=${value}` }).join('&')
}

/**
 * addQueryStr.
 *
 * @param {} url
 * @param {} queryStr
 * @return {String} URLにクエリストリングを追加した結果
 * @memberof lib
 */
const addQueryStr = (url, queryStr) => {
  if (url === undefined) {
    return '/error'
  }

  if (url.indexOf('?') >= 0) {
    return `${url}&${queryStr}`
  }

  return `${url}?${queryStr}`
}

/**
 * paramSnakeToCamel.
 *
 * @param {} paramList
 * @return {Object} オブジェクトのキーをスネークケースからキャメルケースに変換したもの
 * @memberof lib
 */
const paramSnakeToCamel = (paramList = {}) => {
  const newParamList = {}
  Object.entries(paramList).forEach(([key, value]) => {
    const newKey = key.replace(/([_][a-z])/g, (group) => {
      return group.toUpperCase().replace('_', '')
    })
    newParamList[newKey] = value
  })
  return newParamList
}

/* id, auth */
/**
 * getUlid.
 * @return {String} 作成したUUID
 * @memberof lib
 */
const getUlid = () => {
  return mod.ulid()
}

/**
 * getRandomB64UrlSafe.
 *
 * @param {} len
 * @return {String} URLセーフなBase64のランダム文字列
 * @memberof lib
 */
const getRandomB64UrlSafe = (len) => {
  return mod.crypto.randomBytes(len).toString('base64url').slice(0, len)
}

/**
 * 名前付きの引数を展開する
 *
 * @param {Object} obj
 * @return {object} 名前がついている引数を展開したもの
 * @memberof lib
 */
const _argNamed = (obj) => {
  const flattened = {}

  Object.keys(obj).forEach((key) => {
    if (Array.isArray(obj[key])) {
      Object.assign(flattened, obj[key].reduce((prev, curr) => {
        if (typeof curr === 'undefined') {
          throw new Error(`[error] flat argument by list can only contain function but: ${typeof curr} @${key}\n===== maybe you need make func exported like  module.exports = { func, } =====`)
        } else if (typeof curr === 'function') {
          prev[curr.name] = curr
        } else {
          throw new Error(`[error] flat argument by list can only contain function but: ${typeof curr} @${key}`)
        }
        return prev
      }, {}))
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, obj[key])
    } else {
      flattened[key] = obj[key]
    }
  })

  return flattened
}

/**
 * グローバルの関数をセットする。
 *
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const monkeyPatch = () => {
  if (typeof global.argNamed === 'undefined') {
    global.argNamed = _argNamed
  } else {
    console.log('[warn] global.argNamed is already set.')
  }
}


export default {
  init,
  objToQuery,
  addQueryStr,
  paramSnakeToCamel,
  getUlid,
  getRandomB64UrlSafe,

  monkeyPatch,
}

