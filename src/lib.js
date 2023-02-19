const mod = {}

const init = (crypto, ulid) => {
  mod.crypto = crypto
  mod.ulid = ulid
}

const setPgPool = (pgPool) => {
  mod.pgPool = pgPool
}

/* url */
const objToQuery = (obj) => {
  return Object.entries(obj).map(([key, value]) => { return `${key}=${value}` }).join('&')
}

const addQueryStr = (url, queryStr) => {
  if (url === undefined) {
    return '/error'
  }

  if (url.indexOf('?') >= 0) {
    return `${url}&${queryStr}`
  }

  return `${url}?${queryStr}`
}

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
const getUlid = () => {
  return mod.ulid.ulid()
}

const getRandomB64UrlSafe = (len) => {
  return mod.crypto.randomBytes(len).toString('base64url').slice(0, len)
}

const calcSha256AsB64 = (str) => {
  const sha256 = mod.crypto.createHash('sha256')
  sha256.update(str)
  return sha256.digest('base64')
}
const calcSha256HmacAsB64 = (secret, str) => {
  const sha256Hmac = mod.crypto.createHmac('sha256', secret)
  sha256Hmac.update(str)
  return sha256Hmac.digest('base64')
}

const convertToCodeChallenge = (codeVerifier, codeChallengeMethod) => {
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

const getMaxIdInList = (list) => {
  return list.reduce((p, c) => {
    return p > c ? p : c
  })
}

/* date */
const formatDate = (format = 'YYYY-MM-DD hh:mm:ss', date = new Date()) => {
  return format.replace(/YYYY/g, date.getFullYear())
    .replace(/MM/g, (`0${date.getMonth() + 1}`).slice(-2))
    .replace(/DD/g, (`0${date.getDate()}`).slice(-2))
    .replace(/hh/g, (`0${date.getHours()}`).slice(-2))
    .replace(/mm/g, (`0${date.getMinutes()}`).slice(-2))
    .replace(/ss/g, (`0${date.getSeconds()}`).slice(-2))
}

const awaitSleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}


/* db */
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

const waitForPsql = async (maxRetryCnt) => {
  console.log('[info] waitForPsql')
  for await (const retryCnt of [...Array(maxRetryCnt).keys()]) {
    awaitSleep(1 * 1000)
    const { err, result } = execQuery('select 1')
    if (!err && result) {
      return result.rows[0]
    }
    console.log('[info] waiting for psql... retry:', retryCnt)
  }
  return null
}


export default {
  init,
  setPgPool,

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

  execQuery,
  waitForPsql,
}

