/* /common/backend-server/lib.js */
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
}

/* url */
/**
 * objToQuery.
 *
 * @param {} obj
 * @return {String} オブジェクトから作成したクエリストリング
 * @memberof lib
 */
const objToQuery = ({ obj }) => {
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
const addQueryStr = ({ url, queryStr }) => {
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
const paramSnakeToCamel = ({ paramList }) => {
  if (paramList === undefined) {
    paramList = {}
  }

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
const getRandomB64UrlSafe = ({ len }) => {
  return mod.crypto.randomBytes(len).toString('base64url').slice(0, len)
}

/**
 * calcSha256AsB64.
 *
 * @param {} str
 * @return {string} SHA-256ハッシュ
 * @memberof lib
 */
const calcSha256AsB64 = ({ str }) => {
  const sha256 = mod.crypto.createHash('sha256')
  sha256.update(str)
  return sha256.digest('base64')
}
/**
 * calcSha256HmacAsB64.
 *
 * @param {} secret
 * @param {} str
 * @return {string} SHA-256のHMAC
 * @memberof lib
 */
const calcSha256HmacAsB64 = ({ secret, str }) => {
  const sha256Hmac = mod.crypto.createHmac('sha256', secret)
  sha256Hmac.update(str)
  return sha256Hmac.digest('base64')
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
const formatDate = ({ format, date }) => {
  if (format === undefined) {
    format = 'YYYY-MM-DD hh:mm:ss'
  }
  if (date === undefined) {
    date = new Date()
  }

  return format.replace(/YYYY/g, date.getFullYear())
    .replace(/MM/g, (`0${date.getMonth() + 1}`).slice(-2))
    .replace(/DD/g, (`0${date.getDate()}`).slice(-2))
    .replace(/hh/g, (`0${date.getHours()}`).slice(-2))
    .replace(/mm/g, (`0${date.getMinutes()}`).slice(-2))
    .replace(/ss/g, (`0${date.getSeconds()}`).slice(-2))
}

/* db */
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
 * execQuery.
 *
 * @param {} query
 * @param {} paramList
 * @return {Promise(object)} DBアクセスの結果とエラー
 * @memberof lib
 */
const execQuery = async ({ query, paramList }) => {
  if (paramList === undefined) {
    paramList = []
  }

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

/**
 * checkPermission.
 *
 * @param {} splitPermissionList
 * @param {} operationKey
 * @param {} range
 * @param {} dataType
 * @return {boolean} 権限があるかどうか
 * @memberof input
 */
const checkPermission = ({ splitPermissionList, operationKey, range, dataType }) => {
  const { required, optional } = splitPermissionList
  const permissionList = { ...required, ...optional }
  const isAuthorized = Object.entries(permissionList).some(([key, isChecked]) => {
    if (!isChecked) {
      return false
    }
    const keySplit = key.split(':')
    if (keySplit.length !== 3) {
      console.log('[warn] invalid key:', key)
      return false
    }

    if (keySplit[0].indexOf(operationKey) < 0) {
      return false
    }

    if (keySplit[1] !== range) {
      return false
    }

    if (keySplit[2] !== dataType) {
      return false
    }

    return true
  })

  return isAuthorized
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

const _createGlobalLogger = ({ SERVICE_NAME }) => {
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


/**
 * グローバルの関数をセットする。
 *
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const monkeyPatch = ({ SERVICE_NAME }) => {
  if (typeof global.argNamed === 'undefined') {
    global.argNamed = _argNamed
    global.logger = _createGlobalLogger({ SERVICE_NAME })
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
  calcSha256AsB64,
  calcSha256HmacAsB64,

  formatDate,

  setPgPool,
  closePgPool,
  execQuery,

  checkPermission,

  monkeyPatch,
}

