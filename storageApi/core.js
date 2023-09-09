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

/* POST /api/$apiVersion/json/update */
/**
 * handleJsonUpdate.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} owner
 * @param {} jsonPath
 * @param {} content
 * @return {HandleResult} ファイルを更新した結果
 * @memberof core
 */
const handleJsonUpdate = async (clientId, accessToken, owner, jsonPath, content) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'json_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_json_update_access_token'
    return _getErrorResponse(status, error, null)
  }

  const updateJsonResult = await mod.output.updateJson(emailAddress, clientId, owner, jsonPath, content)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { updateJsonResult } }, redirect: null,
  }
}

/* GET /api/$apiVersion/json/content */
/**
 * handleJsonContent.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} owner
 * @param {} jsonPath
 * @memberof core
 */
const handleJsonContent = async (clientId, accessToken, owner, jsonPath) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', owner, 'json_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_json_content_access_token'
    return _getErrorResponse(status, error, null)
  }

  const jsonContent = await mod.input.getJsonContent(emailAddress, clientId, owner, jsonPath)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { jsonContent } }, redirect: null,
  }
}

/* POST /api/$apiVersion/json/delete */
/**
 * handleJsonDelete.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} owner
 * @param {} jsonPath
 * @return {HandleResult} ファイルを削除した結果
 * @memberof core
 */
const handleJsonDelete = async (clientId, accessToken, owner, jsonPath) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'w', owner, 'json_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_json_delete_access_token'
    return _getErrorResponse(status, error, null)
  }

  const deleteJsonResult = await mod.output.deleteJson(emailAddress, clientId, owner, jsonPath)

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { deleteJsonResult } }, redirect: null,
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
const handleFileList = async (clientId, accessToken, owner, fileDir) => {
  const emailAddress = await mod.input.checkPermissionAndGetEmailAddress(accessToken, clientId, 'r', owner, 'file_v1', mod.lib.execQuery, mod.lib.paramSnakeToCamel)

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_list_access_token'
    return _getErrorResponse(status, error, null)
  }

  const fileList = await mod.input.getFileList(clientId, fileDir, mod.lib.execQuery, mod.lib.paramSnakeToCamel)

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
    const error = 'handle_form_create_access_token'
    return _getErrorResponse(status, error, null)
  }

  const { FORM_UPLOAD_DIR } = mod.setting.getList('server.FORM_UPLOAD_DIR')
  fs.writeFileSync(`${FORM_UPLOAD_DIR}${diskFilePath}`, req.file.buffer)

  console.log({ emailAddress })
  console.log({ filePath })
  const filePathSplitList = filePath.split('/')
  if (filePathSplitList.length <= 2 || filePathSplitList[0] !== '') {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID')
    const error = 'handle_form_create_invalid_filePath'
    return _getErrorResponse(status, error, null)
  }
  const fileDir = filePathSplitList.slice(0, filePathSplitList.length - 1).join('/')
  let fileName = filePathSplitList[filePathSplitList.length - 1]
  if (fileName === '') {
    fileName = 'r'
  }

  const user = await mod.input.getUserSerialIdByEmailAddress(emailAddress, mod.lib.execQuery, mod.lib.paramSnakeToCamel)
  console.log({ user })
  if (!user || !user.userSerialId) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_form_create_user'
    return _getErrorResponse(status, error, null)
  }

  const fileLabel = mod.lib.getUlid()
  const createFormResult = await mod.output.createFile(fileLabel, user.userSerialId, clientId, fileDir, fileName, diskFilePath, mod.lib.execQuery)
  console.log({ createFormResult })

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { uploadResult } }, redirect: null,
  }
}


export default {
  init,
  createPgPool,

  isValidSignature,

  handleJsonUpdate,
  handleJsonContent,
  handleJsonDelete,

  handleFileList,

  handleFormCreate,
}

