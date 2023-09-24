/* /output.js */

/**
 * @file
 * @name アプリケーションからのデータ出力に関するファイル
 * @memberof output
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
const init = (setting, fs) => {
  mod.setting = setting

  mod.fs = fs
}

/* to jsonList */
/**
 * updateJson.
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} jsonPath
 * @param {} content
 * @return {boolean} ファイルを更新できたかどうか
 * @memberof output
 */
const updateJson = async (emailAddress, clientId, owner, jsonPath, content) => {
  const jsonList = JSON.parse(mod.fs.readFileSync(mod.setting.getValue('server.FILE_LIST_JSON')))
  if (!jsonList[emailAddress]) {
    jsonList[emailAddress] = {}
  }

  if (!jsonList[emailAddress][owner]) {
    jsonList[emailAddress][owner] = {}
  }

  const dateUpdated = Date.now()
  jsonList[emailAddress][owner][jsonPath] = { dateUpdated, clientId, content }

  mod.fs.writeFileSync(mod.setting.getValue('server.FILE_LIST_JSON'), JSON.stringify(jsonList, null, 2))
  return true
}

/**
 * deleteJson.
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} jsonPath
 * @return {boolean} ファイルを削除できたかどうか
 * @memberof output
 */
const deleteJson = async (emailAddress, clientId, owner, jsonPath) => {
  const jsonList = JSON.parse(mod.fs.readFileSync(mod.setting.getValue('server.FILE_LIST_JSON')))
  if (!jsonList[emailAddress] || !jsonList[emailAddress][owner] || !jsonList[emailAddress][owner][jsonPath]) {
    return false
  }

  delete jsonList[emailAddress][owner][jsonPath]

  mod.fs.writeFileSync(mod.setting.getValue('server.FILE_LIST_JSON'), JSON.stringify(jsonList, null, 2))
  return true
}

/**
 * createFile.
 *
 * @param {} userSerialId
 * @param {} clientId
 * @param {} filePath
 * @param {} diskFilePath
 * @param {} execQuery
 * @return {int} 作成した行数
 * @memberof output
 */
const createFile = async (fileLabel, userSerialId, clientId, fileDir, fileName, diskFilePath, execQuery) => {
  const dateRegistered = Date.now()
  const query = 'insert into file_info.file_list (file_label, client_id, user_serial_id, date_registered, file_dir, file_name, disk_file_path) values ($1, $2, $3, $4, $5, $6, $7)'
  const paramList = [fileLabel, clientId, userSerialId, dateRegistered, fileDir, fileName, diskFilePath]

  const { result } = await execQuery({ query, paramList })
  const { rowCount } = result

  return rowCount
}


/* to http client */
/**
 * endResponse.
 *
 * @param {} req
 * @param {} res
 * @param {} handleResult
 * @return {res.json} ExpressでJSONのレスポンスを返すres.json()の戻り値
 * @memberof output
 */
const endResponse = (req, res, handleResult) => {
  console.log('endResponse:', req.url, handleResult.error)
  if (req.session) {
    req.session.auth = handleResult.session
  }

  if (handleResult.response) {
    if (mod.setting.getValue('api.deprecated')[req.path]) {
      handleResult.response.api = handleResult.response.api || {}
      Object.assign(handleResult.response.api, mod.setting.getValue('api.deprecated')[req.path])
    }

    return res.json(handleResult.response)
  }

  if (req.method === 'GET') {
    if (handleResult.redirect) {
      return res.redirect(handleResult.redirect)
    }
    return res.redirect(mod.setting.getValue('url.ERROR_PAGE'))
  }
  if (handleResult.redirect) {
    return res.json({ redirect: handleResult.redirect })
  }
  return res.json({ redirect: mod.setting.getValue('url.ERROR_PAGE') })
}

export default {
  init,

  updateJson,
  deleteJson,

  createFile,

  endResponse,
}

