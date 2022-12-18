const mod = {}

const init = (crypto, ulid, pg) => {
  mod.crypto = crypto
  mod.ulid = ulid
  
  mod.PGClient = pg.Client
  mod.PGPool = pg.Pool
}

const awaitSleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

/* db */
const waitForPsql = async () => {
  console.log('[info] waitForPsql')
  const dbCredential = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  }

  while(true) {
    await awaitSleep(1 * 1000)
    let client = null
    try {
      const pool = new mod.PGPool(dbCredential)
      client = await pool.connect()
      const res = await client.query('select 1')
      return res.rows[0]
    } catch (err) {
      console.log(err.stack)
      console.log('[info] waiting for psql...')
    } finally {
      if (client) {
        client.release()
      }
    }
  }
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

const paramSnakeToCamel = (paramList) => {
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

/* date */
const formatDate = (format = 'YYYY-MM-DD hh:mm:ss', date = new Date()) => {
  return format.replace(/YYYY/g, date.getFullYear())
    .replace(/MM/g, (`0${date.getMonth() + 1}`).slice(-2))
    .replace(/DD/g, (`0${date.getDate()}`).slice(-2))
    .replace(/hh/g, (`0${date.getHours()}`).slice(-2))
    .replace(/mm/g, (`0${date.getMinutes()}`).slice(-2))
    .replace(/ss/g, (`0${date.getSeconds()}`).slice(-2))
}


export default {
  init,

  awaitSleep,
  waitForPsql,

  objToQuery,
  addQueryStr,
  paramSnakeToCamel,

  getUlid,
  getRandomB64UrlSafe,
  convertToCodeChallenge,
  calcPbkdf2,

  formatDate,
}

