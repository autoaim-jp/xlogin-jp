/* /core/index.js */

import backendServerCore from './backendServerCore.js'

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
const init = ({
  setting, output, input, lib,
}) => {
  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib

  backendServerCore.init({ setting, input, lib })
}

/**
 * createPgPool.
 *
 * @param {} pg
 * @return {pg.Pool} DBの接続プール
 * @memberof core
 */
const createPgPool = ({ pg }) => {
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

/* user */
/**
 * _credentialCheck.
 *
 * @param {} emailAddress
 * @param {} passHmac2
 * @return {credentialCheckResult} メールアドレスとパスワードの組み合わせが正しいかどうか
 * @memberof core
 */
const _credentialCheck = async ({ emailAddress, passHmac2 }) => {
  const { execQuery, paramSnakeToCamel } = mod.lib.backendServerLib
  const user = await mod.input.getUserByEmailAddress({ emailAddress, execQuery, paramSnakeToCamel })
  if (!user) {
    return { credentialCheckResult: false }
  }

  const { calcPbkdf2 } = mod.lib
  const isValidCredential = await mod.input.isValidCredential({
    emailAddress, passHmac2, execQuery, paramSnakeToCamel, calcPbkdf2,
  })

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
  const { execQuery } = mod.lib.backendServerLib
  const isValidClientResult = await mod.input.backendServerInput.isValidClient({ clientId, redirectUri, execQuery })
  if (!isValidClientResult) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CLIENT')
    const error = 'handle_connect_client'
    return backendServerCore.getErrorResponse({ status, error, isServerRedirect: true })
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
  const { execQuery, paramSnakeToCamel } = mod.lib.backendServerLib
  const authSession = await mod.input.getAuthSessionByCode({ code, execQuery, paramSnakeToCamel })
  if (!authSession || authSession.condition !== mod.setting.getValue('condition.CODE')) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_code_session'
    return backendServerCore.getErrorResponse({ status, error, isServerRedirect: true })
  }

  if (clientId !== authSession.clientId) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CLIENT')
    const error = 'handle_code_client'
    return backendServerCore.getErrorResponse({ status, error, isServerRedirect: true })
  }

  const { codeChallengeMethod } = authSession
  const generatedCodeChallenge = mod.lib.convertToCodeChallenge({ codeVerifier, codeChallengeMethod })
  if (authSession.codeChallenge !== generatedCodeChallenge) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CODE_VERIFIER')
    const error = 'handle_code_challenge'
    return backendServerCore.getErrorResponse({ status, error, isServerRedirect: true })
  }

  const accessToken = mod.lib.backendServerLib.getRandomB64UrlSafe({ len: mod.setting.getValue('oidc.ACCESS_TOKEN_L') })

  const newUserSession = { condition: mod.setting.getValue('condition.USER_INFO') }

  const splitPermissionList = JSON.parse(authSession.splitPermissionList)
  const { emailAddress } = authSession
  const resultRegisterAccessToken = await mod.output.registerAccessToken({
    clientId, accessToken, emailAddress, splitPermissionList, execQuery,
  })
  if (!resultRegisterAccessToken) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_code_access_token'
    return backendServerCore.getErrorResponse({ status, error })
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
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const userInfo = await mod.input.getUserByAccessToken({
    clientId, accessToken, filterKeyList, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!userInfo) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_user_info_access_token'
    return backendServerCore.getErrorResponse({ status, error })
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
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'w'
  const range = mod.setting.getValue('server.AUTH_SERVER_CLIENT_ID')
  const dataType = 'backupEmailAddress'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_user_update_backup_email_address'
    return backendServerCore.getErrorResponse({ status, error })
  }
  const userInfoUpdateResult = await mod.output.updateBackupEmailAddressByAccessToken({ emailAddress, backupEmailAddress, execQuery })

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
  const operationKey = 'r'
  const range = notificationRange
  const dataType = 'notification'
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_notification_list_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const notificationList = await mod.input.getNotification({
    emailAddress, notificationRange, execQuery, paramSnakeToCamel,
  })

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
  const operationKey = 'w'
  const range = notificationRange
  const dataType = 'notification'
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_notification_append_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const notificationId = mod.lib.backendServerLib.getUlid()
  const { getMaxIdInList } = mod.lib
  const notificationAppendResult = await mod.output.appendNotification({
    notificationId, clientId, emailAddress, subject, detail, execQuery, getMaxIdInList,
  })

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
  const operationKey = 'w'
  const range = notificationRange
  const dataType = 'notification'
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_notification_open_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const { getMaxIdInList } = mod.lib
  const notificationOpenResult = await mod.output.openNotification({
    notificationIdList, clientId, emailAddress, execQuery, getMaxIdInList,
  })

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
    return backendServerCore.getErrorResponse({ status, error })
  }

  const resultCredentialCheck = await _credentialCheck({ emailAddress, passHmac2 })
  if (resultCredentialCheck.credentialCheckResult !== true) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CREDENTIAL')
    const error = 'handle_credential_credential'
    return backendServerCore.getErrorResponse({ status, error, session: authSession })
  }

  const { execQuery, paramSnakeToCamel } = mod.lib.backendServerLib
  const user = await mod.input.getUserByEmailAddress({ emailAddress, execQuery, paramSnakeToCamel })

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
  const dateStr = mod.lib.backendServerLib.formatDate({ format: mod.setting.browserServerSetting.getValue('userReadableDateFormat.full') })
  let detail = 'Login'
  detail += ` at ${dateStr}`
  const subject = detail
  detail += ` with ${useragent.browser}(${useragent.platform})`
  detail += ` by ${authSession.oidc.clientId}`
  detail += ` from ${ipAddress}`

  const notificationId = mod.lib.backendServerLib.getUlid()
  const { emailAddress } = authSession.user
  const { getMaxIdInList } = mod.lib
  const notificationRange = mod.setting.getValue('server.AUTH_SERVER_CLIENT_ID')
  const { execQuery } = mod.lib.backendServerLib
  // :TODO 引数整理
  const notificationAppendResult = await mod.output.appendNotification({
    notificationId, clientId: notificationRange, emailAddress, subject, detail, execQuery, getMaxIdInList,
  })
  console.log({ notificationAppendResult })

  const serviceUserId = mod.lib.backendServerLib.getRandomB64UrlSafe({ len: mod.setting.getValue('user.SERVICE_USER_ID_L') })
  const { clientId } = authSession.oidc
  await mod.output.registerServiceUserId({
    emailAddress, clientId, serviceUserId, execQuery,
  })

  const code = mod.lib.backendServerLib.getRandomB64UrlSafe({ len: mod.setting.getValue('oidc.CODE_L') })

  const iss = mod.setting.getValue('env.SERVER_ORIGIN')
  const { redirectUri, state } = authSession.oidc
  const redirect = mod.lib.backendServerLib.addQueryStr({ url: decodeURIComponent(redirectUri), queryStr: mod.lib.backendServerLib.objToQuery({ obj: { state, code, iss } }) })

  const newUserSession = Object.assign(authSession, { oidc: Object.assign(authSession.oidc, { condition: mod.setting.getValue('condition.CODE'), code, splitPermissionList }) })

  await mod.output.registerAuthSession({ authSession: newUserSession, execQuery })

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
    return backendServerCore.getErrorResponse({ status, error })
  }

  const { clientId } = authSession.oidc
  const { emailAddress } = authSession.user
  const { execQuery, paramSnakeToCamel } = mod.lib.backendServerLib
  const permissionList = await mod.input.getCheckedRequiredPermissionList({
    clientId, emailAddress, execQuery, paramSnakeToCamel,
  })
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
    return backendServerCore.getErrorResponse({ status, error })
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
    return backendServerCore.getErrorResponse({ status, error })
  }

  if (isTosChecked !== true || isPrivacyPolicyChecked !== true) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_CHECK')
    const error = 'handle_user_add_checkbox'
    return backendServerCore.getErrorResponse({ status, error, session: authSession })
  }

  const { execQuery, paramSnakeToCamel } = mod.lib.backendServerLib
  const userExists = await mod.input.getUserByEmailAddress({ emailAddress, execQuery, paramSnakeToCamel })

  if (userExists) {
    const status = mod.setting.browserServerSetting.getValue('statusList.REGISTER_FAIL')
    const error = 'handle_user_add_register'
    return backendServerCore.getErrorResponse({ status, error, session: authSession })
  }

  const userName = mod.setting.getValue('user.DEFAULT_USER_NAME')
  await mod.output.registerUserByEmailAddress({
    emailAddress, passPbkdf2, saltHex, userName, execQuery,
  })

  const user = await mod.input.getUserByEmailAddress({ emailAddress, execQuery, paramSnakeToCamel })

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
const handleScope = async ({ authSession }) => {
  if (!authSession || !authSession.oidc) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_permission_list_session'
    return backendServerCore.getErrorResponse({ status, error })
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
const handleGlobalNotification = async ({ authSession, notificationRange }) => {
  if (!authSession) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const error = 'handle_notification_list_session'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const { emailAddress } = authSession.user
  const { execQuery, paramSnakeToCamel } = mod.lib.backendServerLib
  const globalNotificationList = await mod.input.getNotification({
    emailAddress, notificationRange, execQuery, paramSnakeToCamel,
  })
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
  backendServerCore,

  init,
  createPgPool,

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

