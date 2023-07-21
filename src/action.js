/* /action.js */

const getHandlerConnect = ({ paramSnakeToCamel, handleConnect, endResponse }) => {
  return async (req, res) => {
    const user = req.session.auth?.user
    const {
      clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, requestScope,
    } = paramSnakeToCamel(req.query)
    const resultHandleConnect = await handleConnect({ user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, requestScope })
    endResponse(req, res, resultHandleConnect)
  }
}

const getHandlerCode = ({ paramSnakeToCamel, handleCode, endResponse }) => {
  return async (req, res) => {
    const {
      clientId, state, code, codeVerifier,
    } = paramSnakeToCamel(req.query)
    const resultHandleCode = await handleCode({ clientId, state, code, codeVerifier })
    endResponse(req, res, resultHandleCode)
  }
}

/* user */
const getHandlerUserInfo = ({ paramSnakeToCamel, handleUserInfo, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { filterKeyListStr } = paramSnakeToCamel(req.query)

    const resultHandleUserInfo = await handleUserInfo(clientId, accessToken, filterKeyListStr)
    endResponse(req, res, resultHandleUserInfo)
  }
}

const getHandlerUserInfoUpdate = ({ paramSnakeToCamel, handleUserInfoUpdate, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { backupEmailAddress } = paramSnakeToCamel(req.body)

    const resultHandleUserInfoUpdate = await handleUserInfoUpdate(clientId, accessToken, backupEmailAddress)
    endResponse(req, res, resultHandleUserInfoUpdate)
  }
}


/* notification */
const getHandlerNotificationList = ({ paramSnakeToCamel, handleNotificationList, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange } = paramSnakeToCamel(req.query)

    const resultHandleNotification = await handleNotificationList(clientId, accessToken, notificationRange)
    endResponse(req, res, resultHandleNotification)
  }
}

const getHandlerNotificationAppend = ({ paramSnakeToCamel, handleNotificationAppend, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange, subject, detail } = paramSnakeToCamel(req.body)

    const resultHandleNotificationAppend = await handleNotificationAppend(clientId, accessToken, notificationRange, subject, detail)
    endResponse(req, res, resultHandleNotificationAppend)
  }
}

const getHandlerNotificationOpen = ({ paramSnakeToCamel, handleNotificationOpen, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange, notificationIdList } = paramSnakeToCamel(req.body)

    const resultHandleNotificationOpen = await handleNotificationOpen(clientId, accessToken, notificationRange, notificationIdList)
    endResponse(req, res, resultHandleNotificationOpen)
  }
}


/* file */
const getHandlerFileUpdate = ({ paramSnakeToCamel, handleFileUpdate, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath, content } = paramSnakeToCamel(req.body)

    const resultHandleFileUpdate = await handleFileUpdate(clientId, accessToken, owner, filePath, content)
    endResponse(req, res, resultHandleFileUpdate)
  }
}

const getHandlerFileContent = ({ paramSnakeToCamel, handleFileContent, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = paramSnakeToCamel(req.query)

    const resultHandleFileContent = await handleFileContent(clientId, accessToken, owner, filePath)
    endResponse(req, res, resultHandleFileContent)
  }
}

const getHandlerFileDelete = ({ paramSnakeToCamel, handleFileDelete, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = paramSnakeToCamel(req.body)

    const resultHandleFileDelete = await handleFileDelete(clientId, accessToken, owner, filePath)
    endResponse(req, res, resultHandleFileDelete)
  }
}

const getHandlerFileList = ({ paramSnakeToCamel, handleFileList, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { owner, filePath } = paramSnakeToCamel(req.query)

    const resultHandleFileList = await handleFileList(clientId, accessToken, owner, filePath)
    endResponse(req, res, resultHandleFileList)
  }
}

/* auth */
const getHandlerCredentialCheck = ({ paramSnakeToCamel, handleCredentialCheck, endResponse }) => {
  return async (req, res) => {
    const { emailAddress, passHmac2 } = paramSnakeToCamel(req.body)
    const resultHandleCredentialCheck = await handleCredentialCheck(emailAddress, passHmac2, req.session.auth)
    endResponse(req, res, resultHandleCredentialCheck)
  }
}

const getHandlerThroughCheck = ({ handleThrough, endResponse }) => {
  return async (req, res) => {
    const { useragent } = req
    const ipAddress = req.headers['x-forwarded-for'] || req.ip
    const authSession = req.session.auth
    const resultHandleThrough = await handleThrough({ ipAddress, useragent, authSession })
    console.dir(resultHandleThrough.response)
    endResponse(req, res, resultHandleThrough)
  }
}

const getHandlerPermissionCheck = ({ paramSnakeToCamel, handleConfirm, endResponse }) => {
  return async (req, res) => {
    const { useragent } = req
    const ipAddress = req.headers['x-forwarded-for'] || req.ip
    const { permissionList } = paramSnakeToCamel(req.body)
    const resultHandleConfirm = await handleConfirm(ipAddress, useragent, permissionList, req.session.auth)
    endResponse(req, res, resultHandleConfirm)
  }
}

const getHandlerUserAdd = ({ handleUserAdd, endResponse }) => {
  return async (req, res) => {
    const {
      emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked,
    } = req.body
    const resultHandleUserAdd = await handleUserAdd(emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, req.session.auth)
    endResponse(req, res, resultHandleUserAdd)
  }
}

const getHandlerScopeList = ({ handleScope, endResponse }) => {
  return async (req, res) => {
    const resultHandleScope = await handleScope(req.session.auth)
    endResponse(req, res, resultHandleScope)
  }
}

const getHandlerGlobalNotification = ({ handleGlobalNotification, ALL_NOTIFICATION, endResponse }) => {
  return async (req, res) => {
    const resultHandleNotification = await handleGlobalNotification(req.session.auth, ALL_NOTIFICATION)
    endResponse(req, res, resultHandleNotification)
  }
}

const getHandlerHandleLogout = ({ handleLogout, endResponse }) => {
  return async (req, res) => {
    const resultHandleLogout = await handleLogout()
    endResponse(req, res, resultHandleLogout)
  }
}


/* common */
const getHandlerCheckSignature = ({ isValidSignature, INVALID_CREDENTIAL, endResponse }) => {
  return async (req, res, next) => {
    const clientId = req.headers['x-xlogin-client-id']
    const timestamp = req.headers['x-xlogin-timestamp']
    const path = req.originalUrl
    const requestBody = req.body
    const signature = req.headers['x-xlogin-signature']

    const isValidSignatureResult = await isValidSignature(clientId, timestamp, path, requestBody, signature)
    if (isValidSignatureResult.signatureCheckResult !== true) {
      const status = INVALID_CREDENTIAL
      const error = 'check_signature'
      const resultGetCheckSignature = {
        status, error, response: false, session: null,
      }
      return endResponse(req, res, resultGetCheckSignature)
    }
    return next()
  }
}

export default {
  getHandlerConnect,
  getHandlerCode,
  getHandlerUserInfo,
  getHandlerUserInfoUpdate,
  getHandlerNotificationList,
  getHandlerNotificationAppend,
  getHandlerNotificationOpen,

  getHandlerFileUpdate,
  getHandlerFileContent,
  getHandlerFileList,
  getHandlerFileDelete,

  getHandlerCredentialCheck,
  getHandlerThroughCheck,
  getHandlerPermissionCheck,
  getHandlerUserAdd,
  getHandlerScopeList,
  getHandlerGlobalNotification,

  getHandlerHandleLogout,

  getHandlerCheckSignature,
}

