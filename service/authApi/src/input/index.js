/* /input/index.js */
import backendServerInput from './backendServerInput.js'

/**
 * @file
 * @name アプリケーションへのデータ入力に関するファイル
 * @memberof input
 */

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

  backendServerInput.init({ setting, fs })
}


/* from userList */
/**
 * getUserByEmailAddress.
 *
 * @param {} emailAddress
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {User} メールアドレスでDBから取得したユーザ
 * @memberof input
 */
const getUserByEmailAddress = async ({ emailAddress, execQuery, paramSnakeToCamel }) => {
  const query = 'select * from user_info.user_list where email_address = $1'
  const paramList = [emailAddress]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }

  const { userName } = paramSnakeToCamel({ paramList: result.rows[0] })
  const user = { emailAddress, userName }
  return user
}

/**
 * isValidCredential.
 *
 * @param {} emailAddress
 * @param {} passHmac2
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @param {} calcPbkdf2
 * @return {boolean} ユーザ名とパスワードが正しいかどうか
 * @memberof input
 */
const isValidCredential = async ({
  emailAddress, passHmac2, execQuery, paramSnakeToCamel, calcPbkdf2,
}) => {
  const query = 'select * from user_info.credential_list where email_address = $1'
  const paramList = [emailAddress]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0) {
    return false
  }

  const { passPbkdf2: correctPassPbkdf2, saltHex } = paramSnakeToCamel({ paramList: result.rows[0] })

  if (!saltHex) {
    return false
  }

  const passPbkdf2 = await calcPbkdf2({ data: passHmac2, saltHex })
  return passPbkdf2 === correctPassPbkdf2
}

/* from authSessionList */
/**
 * getAuthSessionByCode.
 *
 * @param {} code
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {Session} DBから取得したセッション情報
 * @memberof input
 */
const getAuthSessionByCode = async ({ code, execQuery, paramSnakeToCamel }) => {
  const query = 'select * from access_info.auth_session_list where code = $1'
  const paramList = [code]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }

  const authSession = paramSnakeToCamel({ paramList: result.rows[0] })

  return authSession
}

/* from accessTokenList, userList */
/**
 * getUserByAccessToken.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} filterKeyList
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {User} アクセストークンでDBから取得したユーザ情報
 * @memberof input
 */
const getUserByAccessToken = async ({
  clientId, accessToken, filterKeyList, execQuery, paramSnakeToCamel, checkPermission,
}) => {
  /* clientId, accessToken => emailAddress */
  const queryGetEmailAddress = 'select * from access_info.access_token_list where client_id = $1 and access_token = $2'
  const paramListGetEmailAddress = [clientId, accessToken]

  const { err: errGetEmailAddress, result: resultGetEmailAddress } = await execQuery({ query: queryGetEmailAddress, paramList: paramListGetEmailAddress })
  const { rowCount: rowCountGetEmailAddress } = resultGetEmailAddress
  if (errGetEmailAddress || rowCountGetEmailAddress === 0) {
    return null
  }

  const { emailAddress, splitPermissionList: splitPermissionListStr } = paramSnakeToCamel({ paramList: resultGetEmailAddress.rows[0] })
  const splitPermissionList = JSON.parse(splitPermissionListStr)

  /* emailAddress => userInfo */
  const publicData = {}
  for await (const key of filterKeyList) {
    const keySplit = key.split(':')
    if (keySplit.length !== 2) {
      logger.warn('invalid key:', key)
      return null
    }
    const operationKey = 'r'
    const [range, dataType] = keySplit
    if (checkPermission({
      splitPermissionList, operationKey, range, dataType,
    })) {
      if (keySplit[0] === mod.setting.getValue('server.AUTH_SERVER_CLIENT_ID') && keySplit[1] === 'userName') {
        const queryGetUserInfo = 'select * from user_info.user_list where email_address = $1'
        const paramListGetUserInfo = [emailAddress]

        const { err: errGetUserInfo, result: resultGetUserInfo } = await execQuery({ query: queryGetUserInfo, paramList: paramListGetUserInfo })
        const { rowCount: rowCountGetUserInfo } = resultGetUserInfo
        if (errGetUserInfo || rowCountGetUserInfo === 0) {
          publicData[key] = null
        } else {
          const { userName } = paramSnakeToCamel({ paramList: resultGetUserInfo.rows[0] })
          publicData[key] = userName
        }
      } else if (keySplit[0] === mod.setting.getValue('server.AUTH_SERVER_CLIENT_ID') && keySplit[1] === 'backupEmailAddress') {
        const queryGetUserPersonalInfo = 'select * from user_info.personal_data_list where email_address = $1'
        const paramListGetUserPersonalInfo = [emailAddress]

        const { err: errGetUserPersonalInfo, result: resultGetUserPersonalInfo } = await execQuery({ query: queryGetUserPersonalInfo, paramList: paramListGetUserPersonalInfo })
        const { rowCount: rowCountGetUserPersonalInfo } = resultGetUserPersonalInfo
        if (errGetUserPersonalInfo || rowCountGetUserPersonalInfo === 0) {
          publicData[key] = null
        } else {
          const { backupEmailAddress } = paramSnakeToCamel({ paramList: resultGetUserPersonalInfo.rows[0] })
          publicData[key] = backupEmailAddress
        }
      } else if (keySplit[1] === 'serviceUserId') {
        const dataClientId = keySplit[0]
        const queryGetServiceUserInfo = 'select * from user_info.service_user_list where email_address = $1 and client_id = $2'
        const paramListGetServiceUserInfo = [emailAddress, dataClientId]

        const { err: errGetServiceUserInfo, result: resultGetServiceUserInfo } = await execQuery({ query: queryGetServiceUserInfo, paramList: paramListGetServiceUserInfo })
        const { rowCount: rowCountGetServiceUserInfo } = resultGetServiceUserInfo
        if (errGetServiceUserInfo || rowCountGetServiceUserInfo === 0) {
          publicData[key] = null
        } else {
          const { serviceUserId } = paramSnakeToCamel({ paramList: resultGetServiceUserInfo.rows[0] })
          publicData[key] = serviceUserId
        }
      } else if (keySplit[1] === 'emailAddress') {
        publicData[key] = emailAddress
      } else {
        publicData[key] = null
      }
    }
  }

  return { public: publicData }
}

/**
 * getCheckedRequiredPermissionList.
 *
 * @param {} clientId
 * @param {} emailAddress
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {Array} 必須の権限をDBから取得した結果
 * @memberof input
 */
const getCheckedRequiredPermissionList = async ({
  clientId, emailAddress, execQuery, paramSnakeToCamel,
}) => {
  const query = 'select * from access_info.access_token_list where client_id = $1 and email_address = $2'
  const paramList = [clientId, emailAddress]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }
  const { splitPermissionList: splitPermissionListStr } = paramSnakeToCamel({ paramList: result.rows[0] })
  const splitPermissionList = JSON.parse(splitPermissionListStr)

  const { required, optional } = splitPermissionList
  const permissionList = { ...required, ...optional }
  return permissionList
}


/* from notificationList */
/**
 * getNotification.
 *
 * @param {} emailAddress
 * @param {} notificationRange
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {Array} メールアドレスでDBから取得した通知一覧
 * @memberof input
 */
const getNotification = async ({
  emailAddress, notificationRange, execQuery, paramSnakeToCamel,
}) => {
  const queryGetLastOpenedNotificationId = 'select * from notification_info.opened_notification_list where email_address = $1 and notification_range = $2'
  const paramListGetLastOpenedNotificationId = [emailAddress, notificationRange]
  const { err: errGetLastOpenedNotificationId, result: resultGetLastOpenedNotificationId } = await execQuery({ query: queryGetLastOpenedNotificationId, paramList: paramListGetLastOpenedNotificationId })
  let lastOpendNoticationId = '0'
  if (errGetLastOpenedNotificationId) {
    return null
  }
  if (!errGetLastOpenedNotificationId && resultGetLastOpenedNotificationId && resultGetLastOpenedNotificationId.rows[0]) {
    lastOpendNoticationId = paramSnakeToCamel({ paramList: resultGetLastOpenedNotificationId.rows[0] }).notificationId
  }


  let queryGetNotification = 'select * from notification_info.notification_list where email_address = $1 and notification_id > $2'
  const paramListGetNotification = [emailAddress, lastOpendNoticationId]
  if (notificationRange !== mod.setting.getValue('notification.ALL_NOTIFICATION')) {
    queryGetNotification += ' and notification_range = $3'
    paramListGetNotification.push(notificationRange)
  }

  const { err: errGetNotification, result: resultGetNotification } = await execQuery({ query: queryGetNotification, paramList: paramListGetNotification })
  if (errGetNotification) {
    return null
  }
  const filteredNotificationList = {}
  if (resultGetNotification && resultGetNotification.rows) {
    resultGetNotification.rows.forEach((_row) => {
      const row = paramSnakeToCamel({ paramList: _row })
      filteredNotificationList[row.notificationId] = row
    })
  }

  return filteredNotificationList
}

export default {
  backendServerInput,

  init,

  getUserByEmailAddress,
  isValidCredential,

  getAuthSessionByCode,

  getUserByAccessToken,
  getCheckedRequiredPermissionList,

  getNotification,
}

