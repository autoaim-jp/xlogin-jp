/* /core/index.js */

import backendServerCore from './backendServerCore.js'

/**
 * @file
 * @name コア機能を集約したファイル
 * @memberof core
 */
// debug

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
  setting, output, input, lib, fs,
}) => {
  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
  mod.fs = fs

  const { FORM_UPLOAD_DIR } = mod.setting.getList('server.FORM_UPLOAD_DIR')
  output.createUploadDir({ uploadDirDiskPath: FORM_UPLOAD_DIR })

  backendServerCore.init({ setting, input, lib })
}

const initDataFileAndDir = () => {
  logger.debug(mod.setting.getValue('server.FILE_LIST_JSON'))
  if (!mod.fs.existsSync(mod.setting.getValue('server.FILE_LIST_JSON'))) {
    mod.fs.writeFileSync(mod.setting.getValue('server.FILE_LIST_JSON'), '{}')
  }

  if (!mod.fs.existsSync(mod.setting.getValue('server.FORM_UPLOAD_DIR'))) {
    mod.fs.mkdirSync(mod.setting.getValue('server.FORM_UPLOAD_DIR'), '')
  }
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
const handleJsonUpdate = async ({
  clientId, accessToken, owner, jsonPath, content,
}) => {
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'w'
  const range = owner
  const dataType = 'json_v1'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_json_update_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const updateJsonResult = await mod.output.updateJson({
    emailAddress, clientId, owner, jsonPath, content,
  })

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
const handleJsonContent = async ({
  clientId, accessToken, owner, jsonPath,
}) => {
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'r'
  const range = owner
  const dataType = 'json_v1'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })


  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_json_content_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const jsonContent = await mod.input.getJsonContent({
    emailAddress, owner, jsonPath,
  })

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
const handleJsonDelete = async ({
  clientId, accessToken, owner, jsonPath,
}) => {
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'w'
  const range = owner
  const dataType = 'json_v1'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_json_delete_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const deleteJsonResult = await mod.output.deleteJson({
    emailAddress, owner, jsonPath,
  })

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
 * @param {} fileDir
 * @return {HandleResult} 取得したファイル一覧
 * @memberof core
 */
const handleFileList = async ({
  clientId, accessToken, owner, fileDir,
}) => {
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'r'
  const range = owner
  const dataType = 'file_v1'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })

  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_list_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  // :TODO 引数確認
  const fileList = await mod.input.getFileList({
    owner: clientId, fileDir, execQuery, paramSnakeToCamel,
  })

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { fileList } }, redirect: null,
  }
}

/* GET /api/$apiVersion/file/content */
/**
 * handleFileContent.
 *
 * @param {} clientId
 * @param {} accessToken
 * @param {} owner
 * @param {} fileDir
 * @param {} filelabel
 * @return {Buffer} ファイルの中身
 * @memberof core
 */
const handleFileContent = async ({
  clientId, accessToken, owner, fileDir, fileLabel,
}) => {
  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'r'
  const range = owner
  const dataType = 'file_v1'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })


  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusContent.SERVER_ERROR')
    const error = 'handle_file_content_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const diskFilePath = await mod.input.getDiskFilePath({
    owner, fileDir, fileLabel, execQuery, paramSnakeToCamel,
  })

  const { FORM_UPLOAD_DIR } = mod.setting.getList('server.FORM_UPLOAD_DIR')
  const diskFileFullPath = `${FORM_UPLOAD_DIR}${diskFilePath}`
  const fileContent = mod.input.getFileContent({ filePath: diskFileFullPath })

  return fileContent
}


/* POST /api/$apiVersion/file/create */
/**
 * handleFileCreate.
 *
 * @param {} req 
 * @param {} clientId 
 * @param {} accessToken 
 * @return {HandleResult} フォームデータを保存した結果
 * @memberof core
 */
const handleFileCreate = async ({
  req, clientId, accessToken,
}) => {
  const diskFilePath = `${Date.now()}_${Math.round(Math.random() * 1E9)}`

  const FORM_UPLOAD = mod.setting.getValue('key.FORM_UPLOAD')
  const uploadResult = await mod.lib.parseMultipartFileUpload({ req, formKey: FORM_UPLOAD })
  const { owner, filePath } = mod.lib.backendServerLib.paramSnakeToCamel({ paramList: req.body })

  const { execQuery, paramSnakeToCamel, checkPermission } = mod.lib.backendServerLib
  const operationKey = 'w'
  const range = owner
  const dataType = 'file_v1'
  const emailAddress = await mod.input.backendServerInput.checkPermissionAndGetEmailAddress({
    accessToken, clientId, operationKey, range, dataType, execQuery, paramSnakeToCamel, checkPermission,
  })


  if (!emailAddress) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_create_access_token'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const { FORM_UPLOAD_DIR } = mod.setting.getList('server.FORM_UPLOAD_DIR')
  mod.fs.writeFileSync(`${FORM_UPLOAD_DIR}${diskFilePath}`, req.file.buffer)

  const filePathSplitList = filePath.split('/')
  if (filePathSplitList.length <= 2 || filePathSplitList[0] !== '') {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID')
    const error = 'handle_file_create_invalid_filePath'
    return backendServerCore.getErrorResponse({ status, error })
  }
  const fileDir = filePathSplitList.slice(0, filePathSplitList.length - 1).join('/')
  let fileName = filePathSplitList[filePathSplitList.length - 1]
  if (fileName === '') {
    fileName = 'r'
  }

  const user = await mod.input.getUserSerialIdByEmailAddress({ emailAddress, execQuery, paramSnakeToCamel })
  if (!user || !user.userSerialId) {
    const status = mod.setting.browserServerSetting.getValue('statusList.SERVER_ERROR')
    const error = 'handle_file_create_user'
    return backendServerCore.getErrorResponse({ status, error })
  }

  const fileLabel = mod.lib.backendServerLib.getUlid()
  const { userSerialId } = user
  const createFileResult = await mod.output.createFile({
    fileLabel, userSerialId, clientId, fileDir, fileName, diskFilePath, execQuery,
  })
  logger.debug('handleCreateFile', { createFileResult })

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  return {
    status, session: null, response: { result: { uploadResult } }, redirect: null,
  }
}


export default {
  backendServerCore,

  init,
  initDataFileAndDir,
  createPgPool,

  handleJsonUpdate,
  handleJsonContent,
  handleJsonDelete,

  handleFileList,
  handleFileContent,
  handleFileCreate,

}

