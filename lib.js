import crypto from 'crypto'

/* url */
const objToQuery = (obj) => {
  return Object.entries(obj).map(([key, value]) => { return `${key}=${value}` }).join('&')
}

const addQueryStr = (url, queryStr) => {
  if (url === undefined) {
    return '/error'
  } else if (url.indexOf('?') >= 0) {
    return `${url}&${queryStr}`
  } else {
    return `${url}?${queryStr}`
  }
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
const getRandomB64UrlSafe = (len) => {
  return crypto.randomBytes(len).toString('base64url').slice(0, len)
}

const convertToCodeChallenge = (codeVerifier, codeChallengeMethod) => {
  const calcSha256AsB64Url = (str) => {
    const sha256 = crypto.createHash('sha256')
    sha256.update(str)
    return sha256.digest('base64url')
  }
  
  if (codeChallengeMethod === 'S256') {
    return calcSha256AsB64Url(codeVerifier)
  } else {
    throw new Error('unimplemented')
  }
}

const calcPbkdf2 = (data, saltHex) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(data, Buffer.from(saltHex, 'hex'), 1000*1000, 64, 'sha512', (err, derivedKey) => {
      if(err) {
        return resolve(null)
      }
      return resolve(derivedKey.toString('hex'))
    })
  })
}

/* date */
const formatDate = (format = 'YYYY-MM-DD hh:mm:ss', date = new Date()) => {
  return format.replace(/YYYY/g, date.getFullYear())
    .replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
    .replace(/DD/g, ('0' + date.getDate()).slice(-2))
    .replace(/hh/g, ('0' + date.getHours()).slice(-2))
    .replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
    .replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
}


export default {
  objToQuery,
  addQueryStr,
  paramSnakeToCamel,

  getRandomB64UrlSafe,
  convertToCodeChallenge,
  calcPbkdf2,

  formatDate,
}

