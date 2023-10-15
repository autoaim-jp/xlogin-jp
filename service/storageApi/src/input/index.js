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

/* from jsonList */
/**
 * getJsonContent.
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} jsonPath
 * @return {Array} メールアドレスとファイルパスで取得したファイル
 * @memberof input
 */
const getJsonContent = async ({ emailAddress, clientId, owner, jsonPath }) => {
  const jsonList = JSON.parse(mod.fs.readFileSync(mod.setting.getValue('server.FILE_LIST_JSON')))
  if (!jsonList[emailAddress] || !jsonList[emailAddress][owner] || !jsonList[emailAddress][owner][jsonPath]) {
    return null
  }

  return jsonList[emailAddress][owner][jsonPath].content
}

/**
 * getJsonList.
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} jsonPath
 * @return {Array} メールアドレスとファイルパスで取得したファイル内容
 * @memberof input
 */
const getJsonList = async ({ emailAddress, clientId, owner, jsonPath }) => {
  const jsonList = JSON.parse(mod.fs.readFileSync(mod.setting.getValue('server.FILE_LIST_JSON')))
  if (!jsonList[emailAddress] || !jsonList[emailAddress][owner] || !jsonList[emailAddress][owner]) {
    return null
  }

  const resultJsonList = Object.keys(jsonList[emailAddress][owner]).map((_jsonPath) => {
    if (_jsonPath.indexOf(jsonPath) === 0) {
      const jsonObj = { ...jsonList[emailAddress][owner][_jsonPath] }
      delete jsonObj.content
      return jsonObj
    }
    return null
  }).filter((row) => { return row })


  return resultJsonList
}

/**
 * getFileList.
 *
 * @param {} owner
 * @param {} fileDir
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {Array} ファイルリスト
 * @memberof input
 */
const getFileList = async ({ owner, fileDir, execQuery, paramSnakeToCamel }) => {
  const query = 'select * from file_info.file_list where client_id = $1 and file_dir = $2 order by file_label desc'
  const paramList = [owner, fileDir]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result

  if (err || rowCount === 0) {
    return null
  }

  const fileList = []
  result.rows.forEach((row) => {
    const { fileLabel, fileName } = paramSnakeToCamel({ paramList: row })
    const fileInfo = { fileLabel, fileDir, fileName }
    fileList.push(fileInfo)
  })

  return fileList
}

/**
 * getDiskFilePath.
 *
 * @param {} owner
 * @param {} fileDir
 * @param {} fileLabel
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {String} 物理ファイルパス
 * @memberof input
 */
const getDiskFilePath = async ({ owner, fileDir, fileLabel, execQuery, paramSnakeToCamel }) => {
  const query = 'select * from file_info.file_list where client_id = $1 and file_dir = $2 and file_label = $3'
  const paramList = [owner, fileDir, fileLabel]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0 || rowCount !== 1) {
    return null
  }

  const { diskFilePath } = paramSnakeToCamel({ paramList: result.rows[0] })

  return diskFilePath
}


/**
 * getFileContent.
 *
 * @param {} filePath
 * @return {Buffer} ファイルの中身
 * @memberof input
 */
const getFileContent = ({ filePath }) => {
  return mod.fs.readFileSync(filePath)
}

/* from userList */
/**
 * getUserSerialIdByEmailAddress.
 *
 * @param {} emailAddress
 * @param {} execQuery
 * @param {} paramSnakeToCamel
 * @return {User} メールアドレスでDBから取得したユーザ
 * @memberof input
 */
const getUserSerialIdByEmailAddress = async ({ emailAddress, execQuery, paramSnakeToCamel }) => {
  const query = 'select * from user_info.user_list where email_address = $1'
  const paramList = [emailAddress]

  const { err, result } = await execQuery({ query, paramList })
  const { rowCount } = result
  if (err || rowCount === 0) {
    return null
  }

  const { userSerialId } = paramSnakeToCamel({ paramList: result.rows[0] })
  const user = { userSerialId }
  return user
}


export default {
  backendServerInput,

  init,
  
  getJsonContent,
  getJsonList,

  getFileList,
  getFileContent,
  getDiskFilePath,

  getUserSerialIdByEmailAddress,
}

