const crypto = require('crypto')

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


/* id, auth */
const getRandomB64UrlSafe = (len) => {
  return crypto.randomBytes(len).toString('base64url').slice(0, len)
}

const convertToCodeChallenge = (codeVerifier, codeChallengeMethod) => {
  if (codeChallengeMethod === 'S256') {
    return `Base64(S256(${codeVerifier}))`
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

module.exports = {
  objToQuery,
  addQueryStr,

  getRandomB64UrlSafe,
  convertToCodeChallenge,
  calcPbkdf2,
}

