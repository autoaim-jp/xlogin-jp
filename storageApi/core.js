/* /core.js */
/**
 * @file
 * @name コア機能を集約したファイル
 * @memberof core
 */
// debug
import fs from 'fs'

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
  const isValidSignatureResult = await mod.input.isValidSignature(clientId, dataToSign, signature, mod.lib.execQuery, mod.lib.paramSnakeToCamel, mod.lib.calcSha256HmacAsB64)
  if (!isValidSignatureResult) {
    return { signatureCheckResult: false }
  }

  return { signatureCheckResult: true }
}

/* POST /api/$apiVersion/file/update */
/**
 * handleFileUpdate.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} owner
 * @param {} filePath
 * @param {} content
 * @return {HandleResult} ファイルを更新した結果
 * @memberof core
 */
const handleFileUpdate = async (clientId, accessToken, owner, filePath, content) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'json_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_update_access_token'
    return _getErrorResponse(status, error, null)
  }

  const updateFileResult = await mod.output.updateFile(emailAddress, clientId, owner, filePath, content)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { updateFileResult } }, redirect: null,
  }
}

/* GET /api/$apiVersion/file/content */
/**
 * handleFileContent.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} owner
 * @param {} filePath
 * @memberof core
 */
const handleFileContent = async (clientId, accessToken, owner, filePath) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', owner, 'json_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_content_access_token'
    return _getErrorResponse(status, error, null)
  }

  const fileContent = await mod.input.getFileContent(emailAddress, clientId, owner, filePath)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { fileContent } }, redirect: null,
  }
}

/* POST /api/$apiVersion/file/delete */
/**
 * handleFileDelete.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} owner
 * @param {} filePath
 * @return {HandleResult} ファイルを削除した結果
 * @memberof core
 */
const handleFileDelete = async (clientId, accessToken, owner, filePath) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'json_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_delete_access_token'
    return _getErrorResponse(status, error, null)
  }

  const deleteFileResult = await mod.output.deleteFile(emailAddress, clientId, owner, filePath)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { deleteFileResult } }, redirect: null,
  }
}

/* GET /api/$apiVersion/file/list */
/**
 * handleFileList.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} owner
 * @param {} filePath
 * @return {HandleResult} 取得したファイル一覧
 * @memberof core
 */
const handleFileList = async (clientId, accessToken, owner, filePath) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', owner, 'json_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_list_access_token'
    return _getErrorResponse(status, error, null)
  }

  const fileList = await mod.input.getFileList(emailAddress, clientId, owner, filePath)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { fileList } }, redirect: null,
  }
}

/* POST /api/$apiVersion/form/create */
/**
 * handleFormCreate.
 *
 * @param {} req 
 * @param {} clientId 
 * @param {} accessToken 
 * @return {HandleResult} フォームデータを保存した結果
 * @memberof core
 */
const handleFormCreate = async ({
  req, clientId, accessToken,
}) => {
  const diskFilePath = `${Date.now()}_${Math.round(Math.random() * 1E9)}`

  const FORM_UPLOAD = mod.setting.getValue('key.FORM_UPLOAD')
  const uploadResult = await mod.lib.parseMultipartFileUpload(req, FORM_UPLOAD)
  const { owner, filePath } = mod.lib.paramSnakeToCamel(req.body)

  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'file_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_update_access_token'
    return _getErrorResponse(status, error, null)
  }

  const { FORM_UPLOAD_DIR } = mod.setting.getList('server.FORM_UPLOAD_DIR')
  fs.writeFileSync(`${FORM_UPLOAD_DIR}${diskFilePath}`, req.file.buffer)

  console.log({ filePath })
  // const createFormResult = await mod.output.createForm(emailAddress, clientId, owner, filePath, diskFilePath)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { uploadResult } }, redirect: null,
  }
}


export default {
  init,
  createPgPool,

  isValidSignature,

  handleFileUpdate,
  handleFileContent,
  handleFileDelete,
  handleFileList,

  handleFormCreate,
}

