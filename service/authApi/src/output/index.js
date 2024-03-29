/* /output/index.js */
/**
 * @file
 * @name アプリケーションからのデータ出力に関するファイル
 * @memberof output
 */

import backendServerOutput from './backendServerOutput.js'

const mod = {}

/**
 * init.
 *
 * @param {} setting
 * @param {} fs
 * @return {undefined} 戻り値なし
 * @memberof input
 */
const init = ({ setting, fs }) => {
  mod.setting = setting
  mod.fs = fs

  backendServerOutput.init({ setting })
}

/* to userList */
/**
 * registerUserByEmailAddress.
 *
 * @param {} emailAddress
 * @param {} passPbkdf2
 * @param {} saltHex
 * @param {} userName
 * @param {} execQuery
 * @return {boolean} 新規ユーザをDBに登録した結果
 * @memberof output
 */
const registerUserByEmailAddress = async ({
  emailAddress, passPbkdf2, saltHex, userName, execQuery,
}) => {
  const queryAddUser = 'insert into user_info.user_list (email_address, user_name) values ($1, $2)'
  const paramListAddUser = [emailAddress, userName]

  await execQuery({ query: queryAddUser, paramList: paramListAddUser })

  const queryAddCredential = 'insert into user_info.credential_list (email_address, pass_pbkdf2, salt_hex) values ($1, $2, $3)'
  const paramListAddCredential = [emailAddress, passPbkdf2, saltHex]

  await execQuery({ query: queryAddCredential, paramList: paramListAddCredential })

  return true
}

/**
 * registerServiceUserId.
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} serviceUserId
 * @param {} execQuery
 * @return {int} DBに新規登録したサービスのサービスID
 * @memberof output
 */
const registerServiceUserId = async ({
  emailAddress, clientId, serviceUserId, execQuery,
}) => {
  const query = 'insert into user_info.service_user_list (email_address, client_id, service_user_id) values ($1, $2, $3)'
  const paramList = [emailAddress, clientId, serviceUserId]

  const { result } = await execQuery({ query, paramList })
  const { rowCount } = result
  return rowCount
}

/**
 * updateBackupEmailAddressByAccessToken.
 *
 * @param {} emailAddress
 * @param {} backupEmailAddress
 * @param {} execQuery
 * @return {int} DBのバックアップメールアドレスを更新できた件数
 * @memberof output
 */
const updateBackupEmailAddressByAccessToken = async ({ emailAddress, backupEmailAddress, execQuery }) => {
  const query = 'insert into user_info.personal_data_list (email_address, backup_email_address) values ($1, $2) on conflict(email_address) do update set backup_email_address = $2'
  const paramList = [emailAddress, backupEmailAddress]

  const { result } = await execQuery({ query, paramList })
  const { rowCount } = result
  return rowCount
}

/* to authSessionList */
/**
 * registerAuthSession.
 *
 * @param {} authSession
 * @param {} execQuery
 * @return {int} SessionをDBに登録できた件数
 * @memberof output
 */
const registerAuthSession = async ({ authSession, execQuery }) => {
  const query = 'insert into access_info.auth_session_list (code, client_id, condition, code_challenge_method, code_challenge, email_address, split_permission_list) values ($1, $2, $3, $4, $5, $6, $7)'
  const {
    code, clientId, condition, codeChallengeMethod, codeChallenge, splitPermissionList,
  } = authSession.oidc
  const { emailAddress } = authSession.user
  const paramList = [code, clientId, condition, codeChallengeMethod, codeChallenge, emailAddress, JSON.stringify(splitPermissionList)]
  const { result } = await execQuery({ query, paramList })
  const { rowCount } = result

  return rowCount
}

/* to accessTokenList */
/**
 * registerAccessToken.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} emailAddress
 * @param {} splitPermissionList
 * @param {} execQuery
 * @return {int} DBでアクセストークンを作成できた件数
 * @memberof output
 */
const registerAccessToken = async ({
  clientId, accessToken, emailAddress, splitPermissionList, execQuery,
}) => {
  const splitPermissionListStr = JSON.stringify(splitPermissionList)
  const query = 'insert into access_info.access_token_list (access_token, client_id, email_address, split_permission_list) values ($1, $2, $3, $4)'
  const paramList = [accessToken, clientId, emailAddress, splitPermissionListStr]

  const { result } = await execQuery({ query, paramList })
  const { rowCount } = result

  return rowCount
}

/* to notificationList */
/**
 * appendNotification.
 *
 * @param {} notificationId
 * @param {} clientId
 * @param {} emailAddress
 * @param {} subject
 * @param {} detail
 * @param {} execQuery
 * @return {int} DBに通知を登録した件数
 * @memberof output
 */
const appendNotification = async ({
  notificationId, clientId, emailAddress, subject, detail, execQuery,
}) => {
  const dateRegistered = Date.now()
  const isOpened = 0
  const notificationRange = clientId
  const query = 'insert into notification_info.notification_list (notification_id, client_id, email_address, notification_range, date_registered, subject, detail, is_opened) values ($1, $2, $3, $4, $5, $6, $7, $8)'
  const paramList = [notificationId, clientId, emailAddress, notificationRange, dateRegistered, subject, detail, isOpened]

  const { result } = await execQuery({ query, paramList })
  const { rowCount } = result

  return rowCount
}

/**
 * openNotification.
 *
 * @param {} notificationIdList
 * @param {} clientId
 * @param {} emailAddress
 * @param {} execQuery
 * @param {} getMaxIdInList
 * @return {int} DBの通知をオープンした件数
 * @memberof output
 */
const openNotification = async ({
  notificationIdList, clientId, emailAddress, execQuery, getMaxIdInList,
}) => {
  const lastOpendNoticationId = getMaxIdInList({ list: notificationIdList })
  const notificationRange = clientId
  const queryUpdateLastOpenedNotificationId = 'insert into notification_info.opened_notification_list (email_address, notification_range, notification_id) values ($1, $2, $3) on conflict(email_address, notification_range) do update set notification_id = $3'
  const paramListUpdateLastOpenedNotificationId = [emailAddress, notificationRange, lastOpendNoticationId]
  await execQuery({ query: queryUpdateLastOpenedNotificationId, paramList: paramListUpdateLastOpenedNotificationId })

  const queryUpdateNotificationIsOpened = 'update notification_info.notification_list set is_opened = true where notification_id in ($1)'
  const paramListUpdateNotificationIsOpened = [[notificationIdList]]

  const { result: resultUpdateNotificationIsOpened } = await execQuery({ query: queryUpdateNotificationIsOpened, paramList: paramListUpdateNotificationIsOpened })
  const { rowCount: rowCountUpdateNotificationIsOpened } = resultUpdateNotificationIsOpened

  return rowCountUpdateNotificationIsOpened
}

export default {
  backendServerOutput,

  init,

  registerUserByEmailAddress,
  registerServiceUserId,
  updateBackupEmailAddressByAccessToken,
  registerAuthSession,
  registerAccessToken,
  appendNotification,
  openNotification,
}

