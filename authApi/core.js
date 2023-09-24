/* /core.js */
/**
 * @file
 * @name コア機能を集約したファイル
 * @memberof core
 */

/* local setting */
const mod = {}

/**
 * init.
 *
 * @param {} setting
 * @param {} output
 * @param {} input
 * @param {} lib
 * @return {undefined} 戻り値なし
 * @memberof core
 */
const init = (setting, output, input, lib) => {
  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}

/**
 * createPgPool.
 *
 * @param {} pg
 * @return {pg.Pool} DBの接続プール
 * @memberof core
 */
const createPgPool = (pg) => {
  const dbCredential = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    max: 5,
    idleTimeoutMillis: 5 * 1000,
    connectionTimeoutMillis: 5 * 1000,
  }

  return new pg.Pool(dbCredential)
}

/**
 * <pre>
 * _getErrorResponse.
 * エラーを返したいときに呼び出す。
 * パラメータを渡すと、エラーレスポンスを作成する。
 * </pre>
 *
 * @return {HandleResult} エラー処理された結果
 * @memberof core
 */
const _getErrorResponse = (status, error, isServerRedirect, response = null, session = {}) => {
  const redirect = `${mod.setting.getValue('url.ERROR_PAGE')}?error=${encodeURIComponent(error)}`
  if (isServerRedirect) {
    return {
      status, session, response, redirect, error,
    }
  }
  if (response) {
    return {
      status, session, response, error,
    }
  }
  return {
    status, session, response: { status, error, redirect }, error,
  }
}

/**
 * isValidSignature.
 *
 * @param {} clientId
 * @param {} timestamp
 * @param {} path
 * @param {} requestBody
 * @param {} signature
 * @return {signatureCheckResult} クライアントの署名が正しいかどうか
 * @memberof core
 */
const isValidSignature = async (clientId, timestamp, path, requestBody, signature) => {
  const contentHash = mod.lib.calcSha256AsB64(JSON.stringify(requestBody))
  const dataToSign = `${timestamp}:${path}:${contentHash}`
  const isValidSignatureResult = await mod.input.isValidSignature(clientId, dataToSign, signature, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel, mod.lib.calcSha256HmacAsB64)
  if (!isValidSignatureResult) {
    return { signatureCheckResult: false }
  }

  return { signatureCheckResult: true }
}


/* user */
/**
 * _credentialCheck.
 *
 * @param {} emailAddress
 * @param {} passHmac2
 * @return {credentialCheckResult} メールアドレスとパスワードの組み合わせが正しいかどうか
 * @memberof core
 */
const _credentialCheck = async (emailAddress, passHmac2) => {
  const user = await mod.input.getUserByEmailAddress(emailAddress, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)
  if (!user) {
    return { credentialCheckResult: false }
  }

  const isValidCredential = await mod.input.isValidCredential(emailAddress, passHmac2, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel, mod.lib.calcPbkdf2)

  if (!isValidCredential) {
    return { credentialCheckResult: false }
  }

  return { credentialCheckResult: true }
}

/* connect */
/* GET /api/$apiVersion/auth/connect */
/**
 * handleConnect.
 *
 * @param {} user
 * @param {} clientId
 * @param {} redirectUri
 * @param {} state
 * @param {} scope
 * @param {} responseType
 * @param {} codeChallenge
 * @param {} codeChallengeMethod
 * @param {} requestScope
 * @return {HandleResult} Connectした結果
 * @memberof core
 */
const handleConnect = async ({
  user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, requestScope,
}) => {
  const isValidClientResult = await mod.input.isValidClient(clientId, redirectUri, mod.lib.execQuery)
  if (!isValidClientResult) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CLIENT')
    const error = 'handle_connect_client'
    return _getErrorResponse(status, error, true)
  }

  const newUserSession = {
    oidc: {
      clientId, state, scope, responseType, codeChallenge, codeChallengeMethod, redirectUri, requestScope,
    },
  }

  if (user) {
    newUserSession.user = user
    newUserSession.oidc.condition = mod.setting.getValue('condition.CONFIRM')
    const redirect = mod.setting.getValue('url.AFTER_CHECK_CREDENTIAL')
    const status = mod.setting.browserServerSetting.getValue('statusList.OK')
    return {
      status, session: newUserSession, response: null, redirect,
    }
  }

  newUserSession.oidc.condition = mod.setting.getValue('condition.LOGIN')
  const redirect = mod.setting.getValue('url.AFTER_CONNECT')
  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: newUserSession, response: null, redirect,
  }
}

/* GET /api/$apiVersion/auth/code */
/**
 * handleCode.
 *
 * @param {} clientId
 * @param {} code
 * @param {} codeVerifier
 * @return {HandleResult} codeが正しいかどうか処理した結果
 * @memberof core
 */
const handleCode = async ({
  clientId, code, codeVerifier,
}) => {
  const authSession = await mod.input.getAuthSessionByCode(code, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)
  if (!authSession || authSession.condition !== mod.setting.getValue('condition.CODE')) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_code_session'
    return _getErrorResponse(status, error, true)
  }

  if (clientId !== authSession.clientId) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CLIENT')
    const error = 'handle_code_client'
    return _getErrorResponse(status, error, true)
  }

  const generatedCodeChallenge = mod.lib.convertToCodeChallenge(codeVerifier, authSession.codeChallengeMethod)
  if (authSession.codeChallenge !== generatedCodeChallenge) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CODE_VERIFIER')
    const error = 'handle_code_challenge'
    return _getErrorResponse(status, error, true)
  }

  const accessToken = mod.lib.commonServerLib.getRandomB64UrlSafe(mod.setting.getValue('oidc.ACCESS_TOKEN_L'))

  const newUserSession = { condition: mod.setting.getValue('condition.USER_INFO') }

  const splitPermissionList = JSON.parse(authSession.splitPermissionList)
  const resultRegisterAccessToken = await mod.output.registerAccessToken(clientId, accessToken, authSession.emailAddress, splitPermissionList, mod.lib.execQuery)
  if (!resultRegisterAccessToken) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_code_access_token'
    return _getErrorResponse(status, error, null)
  }

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: newUserSession, response: { result: { accessToken, splitPermissionList } }, redirect: null,
  }
}

/* GET /api/$apiVersion/user/info */
/**
 * handleUserInfo.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} filterKeyListStr
 * @return {HandleResult} ユーザ情報を取得した結果
 * @memberof core
 */
const handleUserInfo = async ({ clientId, accessToken, filterKeyListStr }) => {
  const filterKeyList = filterKeyListStr.split(',')
  const userInfo = await mod.input.getUserByAccessToken(clientId, accessToken, filterKeyList, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  if (!userInfo) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_user_info_access_token'
    return _getErrorResponse(status, error, null)
  }


  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { userInfo } }, redirect: null,
  }
}

/* POST /api/$apiVersion/user/update */
/**
 * handleUserInfoUpdate.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} backupEmailAddress
 * @return {HandleResult} ユーザ情報を更新した結果
 * @memberof core
 */
const handleUserInfoUpdate = async (clientId, accessToken, backupEmailAddress) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', mod.setting.getValue('server.AUTH_SERVER_CLIENT_ID'), 'backupEmailAddress', mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_user_update_backup_email_address'
    return _getErrorResponse(status, error, null)
  }
  const userInfoUpdateResult = await mod.output.updateBackupEmailAddressByAccessToken(emailAddress, backupEmailAddress, mod.lib.execQuery)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { userInfoUpdateResult } }, redirect: null,
  }
}


/* GET /api/$apiVersion/notification/list */
/**
 * handleNotificationList.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} notificationRange
 * @return {HandleResult} 取得した通知一覧
 * @memberof core
 */
const handleNotificationList = async (clientId, accessToken, notificationRange) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', notificationRange, 'notification', mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_notification_list_access_token'
    return _getErrorResponse(status, error, null)
  }

  const notificationList = await mod.input.getNotification(emailAddress, notificationRange, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { notificationList } }, redirect: null,
  }
}

/* POST /api/$apiVersion/notification/append */
/**
 * handleNotificationAppend.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} notificationRange
 * @param {} subject
 * @param {} detail
 * @return {HandleResult} 通知を追加した結果
 * @memberof core
 */
const handleNotificationAppend = async (clientId, accessToken, notificationRange, subject, detail) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', notificationRange, 'notification', mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_notification_append_access_token'
    return _getErrorResponse(status, error, null)
  }

  const notificationId = mod.lib.commonServerLib.getUlid()
  const notificationAppendResult = await mod.output.appendNotification(notificationId, notificationRange, emailAddress, subject, detail, mod.lib.execQuery, mod.lib.getMaxIdInList)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { notificationAppendResult } }, redirect: null,
  }
}

/* POST /api/$apiVersion/notification/open */
/**
 * handleNotificationOpen.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} notificationRange
 * @param {} notificationIdList
 * @return {HandleResult} 通知をオープンした結果
 * @memberof core
 */
const handleNotificationOpen = async (clientId, accessToken, notificationRange, notificationIdList) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', notificationRange, 'notification', mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_notification_open_access_token'
    return _getErrorResponse(status, error, null)
  }

  const notificationOpenResult = await mod.output.openNotification(notificationIdList, notificationRange, emailAddress, mod.lib.execQuery, mod.lib.getMaxIdInList)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { notificationOpenResult } }, redirect: null,
  }
}

/* POST /f/$condition/credential/check */
/**
 * handleCredentialCheck.
 *
 * @param {} emailAddress
 * @param {} passHmac2
 * @param {} authSession
 * @return {HandleResult} メールアドレスとパスワードを確認した結果
 * @memberof core
 */
const handleCredentialCheck = async ({ emailAddress, passHmac2, authSession }) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_credential_session'
    return _getErrorResponse(status, error, false)
  }

  const resultCredentialCheck = await _credentialCheck(emailAddress, passHmac2)
  if (resultCredentialCheck.credentialCheckResult !== true) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CREDENTIAL')
    const error = 'handle_credential_credential'
    return _getErrorResponse(status, error, false, null, authSession)
  }

  const user = await mod.input.getUserByEmailAddress(emailAddress, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.getValue('condition.CONFIRM') }) }, { user })
  const redirect = mod.setting.getValue('url.AFTER_CHECK_CREDENTIAL')

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: newUserSession, response: { redirect }, redirect: null,
  }
}

/* after /f/confirm/ */
/**
 * _afterCheckPermission.
 *
 * @param {} ipAddress
 * @param {} useragent
 * @param {} authSession
 * @param {} splitPermissionList
 * @return {HandleResult} パーミッションをチェックした後の結果
 * @memberof core
 */
const _afterCheckPermission = async (ipAddress, useragent, authSession, splitPermissionList) => {
  let detail = 'Login'
  detail += ` at ${mod.lib.formatDate(mod.setting.browserServerSetting.getValue('userReadableDateFormat.full'))}`
  const subject = detail
  detail += ` with ${useragent.browser}(${useragent.platform})`
  detail += ` by ${authSession.oidc.clientId}`
  detail += ` from ${ipAddress}`

  const notificationId = mod.lib.commonServerLib.getUlid()
  await mod.output.appendNotification(notificationId, mod.setting.getValue('server.AUTH_SERVER_CLIENT_ID'), authSession.user.emailAddress, subject, detail, mod.lib.execQuery)


  const serviceUserId = mod.lib.commonServerLib.getRandomB64UrlSafe(mod.setting.getValue('user.SERVICE_USER_ID_L'))
  await mod.output.registerServiceUserId(authSession.user.emailAddress, authSession.oidc.clientId, serviceUserId, mod.lib.execQuery)

  const code = mod.lib.commonServerLib.getRandomB64UrlSafe(mod.setting.getValue('oidc.CODE_L'))

  const iss = mod.setting.getValue('env.SERVER_ORIGIN')
  const { redirectUri, state } = authSession.oidc
  const redirect = mod.lib.commonServerLib.addQueryStr(decodeURIComponent(redirectUri), mod.lib.commonServerLib.objToQuery({ state, code, iss }))

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.getValue('condition.CODE'), code, splitPermissionList }) })

  await mod.output.registerAuthSession(newUserSession, mod.lib.execQuery)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: newUserSession, response: { redirect }, redirect: null,
  }
}

/* POST /f/confirm/through/check */
/**
 * handleThrough.
 *
 * @param {} ipAddress
 * @param {} useragent
 * @param {} authSession
 * @return {HandleResult} 既に認証ができているかどうか確認した結果
 * @memberof core
 */
const handleThrough = async ({ ipAddress, useragent, authSession }) => {
  if (!authSession || !authSession.oidc || authSession.oidc.condition !== mod.setting.getValue('condition.CONFIRM')) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_confirm_session'
    return _getErrorResponse(status, error, false)
  }

  const permissionList = await mod.input.getCheckedRequiredPermissionList(authSession.oidc.clientId, authSession.user.emailAddress, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)
  const { scope, requestScope } = authSession.oidc

  if (!permissionList) {
    const status = mod.setting.browserServerSetting.getValue('statusList.NOT_FOUND')
    const result = { oldPermissionList: null, requestScope }
    return {
      status, session: authSession, response: { result }, redirect: null,
    }
  }

  let uncheckedPermissionExists = false
  const splitPermissionList = { required: {}, optional: {} }
  scope.split(',').forEach((_key) => {
    let key = _key
    if (_key[0] === '*') {
      key = _key.slice(1)
      splitPermissionList.required[key] = permissionList[key]

      if (!permissionList[key]) {
        uncheckedPermissionExists = true
      }
    } else {
      splitPermissionList.optional[key] = permissionList[key]
    }
  })
  requestScope.split(',').forEach((key) => {
    if (key === '') {
      return
    }

    if (!permissionList[key]) {
      uncheckedPermissionExists = true
    }
  })

  if (uncheckedPermissionExists) {
    const status = mod.setting.browserServerSetting.getValue('statusList.NOT_ENOUGH_PARAM')
    const result = { oldPermissionList: permissionList, requestScope }
    return {
      status, session: authSession, response: { result }, redirect: null,
    }
  }

  const resultAfterCheckPermission = await _afterCheckPermission(ipAddress, useragent, authSession, splitPermissionList)
  return resultAfterCheckPermission
}

/* POST /f/confirm/permission/check */
/**
 * handleConfirm.
 *
 * @param {} ipAddress
 * @param {} useragent
 * @param {} permissionList
 * @param {} authSession
 * @return {HandleResult} 権限を登録した結果
 * @memberof core
 */
const handleConfirm = async ({
  ipAddress, useragent, permissionList, authSession,
}) => {
  if (!authSession || !authSession.oidc || authSession.oidc.condition !== mod.setting.getValue('condition.CONFIRM')) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_confirm_session'
    return _getErrorResponse(status, error, false)
  }

  const { scope } = authSession.oidc
  let uncheckedRequiredPermissionExists = false
  const splitPermissionList = { required: {}, optional: {} }
  scope.split(',').forEach((_key) => {
    let key = _key
    if (_key[0] === '*') {
      key = _key.slice(1)
      splitPermissionList.required[key] = permissionList[key]
      if (!permissionList[key]) {
        uncheckedRequiredPermissionExists = true
      }
    } else {
      splitPermissionList.optional[key] = permissionList[key]
    }
  })

  if (uncheckedRequiredPermissionExists) {
    const status = mod.setting.browserServerSetting.getValue('statusList.NOT_ENOUGH_PARAM')
    const result = { isRequiredScopeChecked: false }
    return {
      status, session: authSession, response: { result }, redirect: null,
    }
  }

  const resultAfterCheckPermission = await _afterCheckPermission(ipAddress, useragent, authSession, splitPermissionList)
  return resultAfterCheckPermission
}

/* POST /f/login/user/add */
/**
 * handleUserAdd.
 *
 * @param {} emailAddress
 * @param {} passPbkdf2
 * @param {} saltHex
 * @param {} isTosChecked
 * @param {} isPrivacyPolicyChecked
 * @param {} authSession
 * @return {HandleResult} ユーザを追加した結果
 * @memberof core
 */
const handleUserAdd = async ({
  emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, authSession,
}) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_user_add_session'
    return _getErrorResponse(status, error, false)
  }

  if (isTosChecked !== true || isPrivacyPolicyChecked !== true) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CHECK')
    const error = 'handle_user_add_checkbox'
    return _getErrorResponse(status, error, false, null, authSession)
  }

  const userExists = await mod.input.getUserByEmailAddress(emailAddress, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  if (userExists) {
    const status = mod.setting.browserServerSetting.getValue('statusList.REGISTER_FAIL')
    const error = 'handle_user_add_register'
    return _getErrorResponse(status, error, false, null, authSession)
  }

  const userName = mod.setting.getValue('user.DEFAULT_USER_NAME')
  await mod.output.registerUserByEmailAddress(emailAddress, passPbkdf2, saltHex, userName, mod.lib.execQuery)

  const user = await mod.input.getUserByEmailAddress(emailAddress, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.getValue('condition.CONFIRM') }) }, { user })
  const redirect = mod.setting.getValue('url.AFTER_CHECK_CREDENTIAL')

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: newUserSession, response: { redirect }, redirect: null,
  }
}

/* GET /f/confirm/scope/list */
/**
 * handleScope.
 *
 * @param {} authSession
 * @return {HandleResult} スコープ一覧
 * @memberof core
 */
const handleScope = async (authSession) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_permission_list_session'
    return _getErrorResponse(status, error, false)
  }

  const { scope } = authSession.oidc
  const status = mod.setting.browserServerSetting.getValue('statusList.OK')

  return {
    status, session: authSession, response: { result: { scope } },
  }
}

/* GET /f/notification/global/list */
/**
 * handleGlobalNotification.
 *
 * @param {} authSession
 * @param {} ALL_NOTIFICATION
 * @return {HandleResult} 全サービスの通知一覧
 * @memberof core
 */
const handleGlobalNotification = async (authSession, ALL_NOTIFICATION) => {
  if (!authSession) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_notification_list_session'
    return _getErrorResponse(status, error, false)
  }

  const globalNotificationList = await mod.input.getNotification(authSession.user.emailAddress, ALL_NOTIFICATION, mod.lib.execQuery, mod.lib.commonServerLib.paramSnakeToCamel)
  const status = mod.setting.browserServerSetting.getValue('statusList.OK')

  return {
    status, session: authSession, response: { result: { globalNotificationList } },
  }
}

/* GET /logout */
/**
 * handleLogout.
 * @return {HandleResult} ログアウト処理した結果
 * @memberof core
 */
const handleLogout = async () => {
  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: {}, response: null, redirect: '/',
  }
}

export default {
  init,
  createPgPool,

  isValidSignature,

  handleConnect,
  handleCode,
  handleUserInfo,
  handleUserInfoUpdate,

  handleNotificationList,
  handleNotificationAppend,
  handleNotificationOpen,

  handleCredentialCheck,
  handleThrough,
  handleConfirm,
  handleUserAdd,
  handleScope,
  handleGlobalNotification,

  handleLogout,
}

