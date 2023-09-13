/* /lib.js */
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
const init = (crypto, ulid, multer) => {
  mod.crypto = crypto
  mod.ulid = ulid
  mod.multer = multer
}

/**
 * setPgPool.
 *
 * @param {} pgPool
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const setPgPool = (pgPool) => {
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
  return mod.ulid.ulid()
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
 * calcSha256AsB64.
 *
 * @param {} str
 * @return {string} SHA-256ハッシュ
 * @memberof lib
 */
const calcSha256AsB64 = (str) => {
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
const calcSha256HmacAsB64 = (secret, str) => {
  const sha256Hmac = mod.crypto.createHmac('sha256', secret)
  sha256Hmac.update(str)
  return sha256Hmac.digest('base64')
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


/**
 * waitForPsql.
 *
 * @param {} maxRetryCnt
 * @return {undefined} 戻り値なし
 * @memberof lib
 */
const waitForPsql = async (maxRetryCnt) => {
  console.log('[info] waitForPsql')
  for await (const retryCnt of [...Array(maxRetryCnt).keys()]) {
    await awaitSleep(1 * 1000)
    const { err, result } = await execQuery('select 1')
    console.log({ err, result })
    if (!err && result) {
      return result.rows[0]
    }
    console.log('[info] waiting for psql... retry:', retryCnt)
  }
  return null
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
  setPgPool,
  closePgPool,

  objToQuery,
  addQueryStr,
  paramSnakeToCamel,

  getUlid,
  getRandomB64UrlSafe,
  calcSha256AsB64,
  calcSha256HmacAsB64,
  convertToCodeChallenge,
  calcPbkdf2,
  getMaxIdInList,

  formatDate,
  awaitSleep,

  parseMultipartFileUpload,

  execQuery,
  waitForPsql,

  monkeyPatch,
}

