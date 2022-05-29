const generateSessionId = (len) => {
  const sessionIdVerifier = 'deadbeef'.repeat(len / 8).slice(0, len)
  const sessionId = `sha256(${sessionIdVerifier})`
  return { sessionId, sessionIdVerifier }
}

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

const getRandomStr = (len) => {
  return 'deadbeef'.repeat(len / 8).slice(0, len)
}

const convertToCodeChallenge = (codeVerifier, codeChallengeMethod) => {
  if (codeChallengeMethod === 'S256') {
    return `Base64(S256(${codeVerifier}))`
  } else {
    throw new Error('unimplemented')
  }
}



module.exports = {
  generateSessionId,
  objToQuery,
  addQueryStr,
  getRandomStr,
  convertToCodeChallenge,
}

