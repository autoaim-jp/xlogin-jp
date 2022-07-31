/* /core.js */
/* local setting */
const mod = {}

const init = (setting, lib) => {
  mod.setting = setting
  mod.lib = lib
}

const credentialCheck = async (getUserByEmailAddress, emailAddress, passHmac2) => {
  const user = getUserByEmailAddress(emailAddress)
  if (!user) {
    return { credentialCheckResult: false }
  }

  const saltHex = user.saltHex

  const passPbkdf2 = await mod.lib.calcPbkdf2(passHmac2, saltHex)
  if(user.passPbkdf2 !== passPbkdf2) {
    return { credentialCheckResult: false }
  }

  return { credentialCheckResult: true }
}

const addUser = (getUserByEmailAddress, registerUserByEmailAddress, clientId, emailAddress, passPbkdf2, saltHex) => {
  if (getUserByEmailAddress(emailAddress)) {
    return { registerResult: false }
  }

  const user = {
    emailAddress,
    passPbkdf2,
    saltHex,
    userName: 'no name',
    serviceVariable: {}
  }

  if (clientId) {
    const serviceUserId = mod.lib.getRandomB64UrlSafe(mod.setting.user.SERVICE_USER_ID_L)
    user.serviceVariable[clientId] = { serviceUserId }
  }

  registerUserByEmailAddress(emailAddress, user)

  return { registerResult: true }
}

export default {
  init,
  credentialCheck,
  addUser,
}
