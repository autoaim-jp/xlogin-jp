/* /action.js */
/**
 * @file
 * @name イベントが発生したら動くアクションをまとめたファイル
 * @memberof action
 */

/**
 * getHandlerConnect.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleConnect
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerConnect = ({ paramSnakeToCamel, handleConnect, endResponse }) => {
  return async (req, res) => {
    const user = req.session.auth?.user
    const {
      clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, requestScope,
    } = paramSnakeToCamel({ paramList: req.query })
    const resultHandleConnect = await handleConnect({
      user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, requestScope,
    })
    endResponse({ req, res, handleResult: resultHandleConnect })
  }
}

/**
 * getHandlerCode.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleCode
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerCode = ({ paramSnakeToCamel, handleCode, endResponse }) => {
  return async (req, res) => {
    const {
      clientId, code, codeVerifier,
    } = paramSnakeToCamel({ paramList: req.query })
    const resultHandleCode = await handleCode({
      clientId, code, codeVerifier,
    })
    endResponse({ req, res, handleResult: resultHandleCode })
  }
}

/* user */
/**
 * getHandlerUserInfo.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleUserInfo
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerUserInfo = ({ paramSnakeToCamel, handleUserInfo, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { filterKeyListStr } = paramSnakeToCamel({ paramList: req.query })

    const resultHandleUserInfo = await handleUserInfo({ clientId, accessToken, filterKeyListStr })
    endResponse({ req, res, handleResult: resultHandleUserInfo })
  }
}

/**
 * getHandlerUserInfoUpdate.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleUserInfoUpdate
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerUserInfoUpdate = ({ paramSnakeToCamel, handleUserInfoUpdate, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { backupEmailAddress } = paramSnakeToCamel({ paramList: req.body })

    const resultHandleUserInfoUpdate = await handleUserInfoUpdate(clientId, accessToken, backupEmailAddress)
    endResponse({ req, res, handleResult: resultHandleUserInfoUpdate })
  }
}


/* notification */
/**
 * getHandlerNotificationList.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleNotificationList
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerNotificationList = ({ paramSnakeToCamel, handleNotificationList, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange } = paramSnakeToCamel({ paramList: req.query })

    const resultHandleNotification = await handleNotificationList(clientId, accessToken, notificationRange)
    endResponse({ req, res, handleResult: resultHandleNotification })
  }
}

/**
 * getHandlerNotificationSelectList.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleNotificationSelectList
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerNotificationSelectList = ({ paramSnakeToCamel, handleNotificationSelectList, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange, notificationId } = paramSnakeToCamel({ paramSelectList: req.query })

    const resultHandleNotification = await handleNotificationSelectList(clientId, accessToken, notificationRange, notificationId)
    endResponse({ req, res, handleResult: resultHandleNotification })
  }
}


/**
 * getHandlerNotificationAppend.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleNotificationAppend
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerNotificationAppend = ({ paramSnakeToCamel, handleNotificationAppend, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange, subject, detail } = paramSnakeToCamel({ paramList: req.body })

    const resultHandleNotificationAppend = await handleNotificationAppend(clientId, accessToken, notificationRange, subject, detail)
    endResponse({ req, res, handleResult: resultHandleNotificationAppend })
  }
}

/**
 * getHandlerNotificationOpen.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleNotificationOpen
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerNotificationOpen = ({ paramSnakeToCamel, handleNotificationOpen, endResponse }) => {
  return async (req, res) => {
    const accessToken = req.headers.authorization.slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { notificationRange, notificationIdList } = paramSnakeToCamel({ paramList: req.body })

    const resultHandleNotificationOpen = await handleNotificationOpen(clientId, accessToken, notificationRange, notificationIdList)
    endResponse({ req, res, handleResult: resultHandleNotificationOpen })
  }
}

/* auth */
/**
 * getHandlerCredentialCheck.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleCredentialCheck
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerCredentialCheck = ({ paramSnakeToCamel, handleCredentialCheck, endResponse }) => {
  return async (req, res) => {
    const { emailAddress, passHmac2 } = paramSnakeToCamel({ paramList: req.body })
    const resultHandleCredentialCheck = await handleCredentialCheck({ emailAddress, passHmac2, authSession: req.session.auth })
    endResponse({ req, res, handleResult: resultHandleCredentialCheck })
  }
}

/**
 * getHandlerThroughCheck.
 *
 * @param {} handleThrough
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerThroughCheck = ({ handleThrough, endResponse }) => {
  return async (req, res) => {
    const { useragent } = req
    const ipAddress = req.headers['x-forwarded-for'] || req.ip
    const authSession = req.session.auth
    const resultHandleThrough = await handleThrough({ ipAddress, useragent, authSession })
    endResponse({ req, res, handleResult: resultHandleThrough })
  }
}

/**
 * getHandlerPermissionCheck.
 *
 * @param {} paramSnakeToCamel
 * @param {} handleConfirm
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerPermissionCheck = ({ paramSnakeToCamel, handleConfirm, endResponse }) => {
  return async (req, res) => {
    const { useragent } = req
    const ipAddress = req.headers['x-forwarded-for'] || req.ip
    const { permissionList } = paramSnakeToCamel({ paramList: req.body })
    const resultHandleConfirm = await handleConfirm({
      ipAddress, useragent, permissionList, authSession: req.session.auth,
    })
    endResponse({ req, res, handleResult: resultHandleConfirm })
  }
}

/**
 * getHandlerUserAdd.
 *
 * @param {} handleUserAdd
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerUserAdd = ({ handleUserAdd, endResponse }) => {
  return async (req, res) => {
    const {
      emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked,
    } = req.body
    const resultHandleUserAdd = await handleUserAdd({
      emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, authSession: req.session.auth,
    })
    endResponse({ req, res, handleResult: resultHandleUserAdd })
  }
}

/**
 * getHandlerScopeList.
 *
 * @param {} handleScope
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerScopeList = ({ handleScope, endResponse }) => {
  return async (req, res) => {
    const authSession = req.session.auth
    const resultHandleScope = await handleScope({ authSession })
    endResponse({ req, res, handleResult: resultHandleScope })
  }
}

/**
 * getHandlerGlobalNotification.
 *
 * @param {} handleGlobalNotification
 * @param {} ALL_NOTIFICATION
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerGlobalNotification = ({ handleGlobalNotification, ALL_NOTIFICATION, endResponse }) => {
  return async (req, res) => {
    const authSession = req.session.auth
    const notificationRange = ALL_NOTIFICATION
    const resultHandleNotification = await handleGlobalNotification({ authSession, notificationRange })
    endResponse({ req, res, handleResult: resultHandleNotification })
  }
}

/**
 * getHandlerHandleLogout.
 *
 * @param {} handleLogout
 * @param {} endResponse
 * @return {Promise()} Promise内の戻り値なし
 * @memberof action
 */
const getHandlerHandleLogout = ({ handleLogout, endResponse }) => {
  return async (req, res) => {
    const resultHandleLogout = await handleLogout()
    endResponse({ req, res, handleResult: resultHandleLogout })
  }
}


/* common */
/**
 * getHandlerCheckSignature.
 *
 * @param {} isValidSignature
 * @param {} INVALID_CREDENTIAL
 * @param {} endResponse
 * @return {Promise(Express.next())} 署名が正しかった場合はnext()が呼び出される
 * @memberof action
 */
const getHandlerCheckSignature = ({ isValidSignature, INVALID_CREDENTIAL, endResponse }) => {
  return async (req, res, next) => {
    const clientId = req.headers['x-xlogin-client-id']
    const timestamp = req.headers['x-xlogin-timestamp']
    const path = req.originalUrl
    const requestBody = req.body
    const signature = req.headers['x-xlogin-signature']

    const isValidSignatureResult = await isValidSignature({
      clientId, timestamp, path, requestBody, signature,
    })
    if (isValidSignatureResult.signatureCheckResult !== true) {
      const status = INVALID_CREDENTIAL
      const error = 'check_signature'
      const resultGetCheckSignature = {
        status, error, response: false, session: null,
      }
      return endResponse({ req, res, handleResult: resultGetCheckSignature })
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
  getHandlerNotificationSelectList,
  getHandlerNotificationAppend,
  getHandlerNotificationOpen,

  getHandlerCredentialCheck,
  getHandlerThroughCheck,
  getHandlerPermissionCheck,
  getHandlerUserAdd,
  getHandlerScopeList,
  getHandlerGlobalNotification,

  getHandlerHandleLogout,

  getHandlerCheckSignature,
}

