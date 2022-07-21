/* /core.js */
const s = {}
const ACCESS_TOKEN_LIST = {}

const USER_LIST = {
  'user@example.com': {
    emailAddress: 'user@example.com',
    userName: 'sample user',
    passPbkdf2: 'ca134addc89453fd281e2854236e8d65cf3bdc94b57aa451977a316319586c476fc70c12e124c16dde13675d1ad493e24351958076815440b0f0cff16231b38a',
    saltHex: 'e04a00bb39f9d733ca02cafce730b887d66262a749ea7f237f30d0e4194927868c687339c56b0ed9ccf141ae1079086fa64a4d836e620c6d5490cfaecd0192c5',
    serviceVariable: {
      'foo': {
        serviceUserId: '123456',
      },
      'sample_xlogin_jp': {
        serviceUserId: 'abcdef',
      },
    },
  }
}

const init = (SERVICE_USER_ID_L, ERROR_PAGE) => {
  s.SERVICE_USER_ID_L = SERVICE_USER_ID_L
  s.ERROR_PAGE = ERROR_PAGE
}

const getUserByEmailAddress = (emailAddress) => {
  return USER_LIST[emailAddress]
}
const _registerUserByEmailAddress = (emailAddress, user) => {
  USER_LIST[emailAddress] = user
}

const registerAccessToken = (clientId, accessToken, user, permissionList) => {
  ACCESS_TOKEN_LIST[accessToken] = { clientId, user, permissionList }
  return true
}

const getUserByAccessToken = (clientId, accessToken, filterKeyList) => {
  if (ACCESS_TOKEN_LIST[accessToken] && ACCESS_TOKEN_LIST[accessToken].clientId === clientId) {
    const { user, permissionList } = ACCESS_TOKEN_LIST[accessToken]
    const publicData = {}
    filterKeyList.forEach((key) => {
      const permission = `r:${key}`
      if (permissionList[permission]) {
        publicData[key] = user[key] || user.serviceVariable[clientId][key]
      }
    })
    return { public: publicData }
  }

  return null
}

const credentialCheck = async (calcPbkdf2, emailAddress, passHmac2) => {
  if (!getUserByEmailAddress(emailAddress)) {
    return { credentialCheckResult: false }
  }

  const saltHex = getUserByEmailAddress(emailAddress).saltHex

  const passPbkdf2 = await calcPbkdf2(passHmac2, saltHex)
  if(getUserByEmailAddress(emailAddress).passPbkdf2 !== passPbkdf2) {
    return { credentialCheckResult: false }
  }

  return { credentialCheckResult: true }
}

const addUser = (getRandomB64UrlSafe, clientId, emailAddress, passPbkdf2, saltHex) => {
  if (getUserByEmailAddress(emailAddress)) {
    return { registerResult: false }
  }

  const user = {
    passPbkdf2,
    saltHex,
    userName: 'no name',
    serviceVariable: {}
  }

  if (clientId) {
    const serviceUserId = getRandomB64UrlSafe(s.SERVICE_USER_ID_L)
    user.serviceVariable[clientId] = { serviceUserId }
  }

  _registerUserByEmailAddress(emailAddress, user)

  return { registerResult: true }
}

/* http */
const getErrorResponse = (status, error, isServerRedirect, response = null, session = {}) => {
  const redirect = `${s.ERROR_PAGE}?error=${encodeURIComponent(error)}`
  if (isServerRedirect) {
    return { status, session, response, redirect, error }
  } else {
    if (response) {
      return { status, session, response, error }
    } else {
      return { status, session, response: { status, error, redirect }, error }
    }
  }
}


export default {
  init,
  getUserByEmailAddress,
  registerAccessToken,
  getUserByAccessToken,
  credentialCheck,
  addUser,
  getErrorResponse,
}