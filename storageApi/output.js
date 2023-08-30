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

/* to fileList */
/**
 * updateFile.
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} filePath
 * @param {} content
 * @return {boolean} ファイルを更新できたかどうか
 * @memberof output
 */
const updateFile = async (emailAddress, clientId, owner, filePath, content) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.getValue('server.FILE_LIST_JSON')))
  if (!fileList[emailAddress]) {
    fileList[emailAddress] = {}
  }

  if (!fileList[emailAddress][owner]) {
    fileList[emailAddress][owner] = {}
  }

  const dateUpdated = Date.now()
  fileList[emailAddress][owner][filePath] = { dateUpdated, clientId, content }

  mod.fs.writeFileSync(mod.setting.getValue('server.FILE_LIST_JSON'), JSON.stringify(fileList, null, 2))
  return true
}

/**
 * deleteFile.
 *
 * @param {} emailAddress
 * @param {} clientId
 * @param {} owner
 * @param {} filePath
 * @return {boolean} ファイルを削除できたかどうか
 * @memberof output
 */
const deleteFile = async (emailAddress, clientId, owner, filePath) => {
  const fileList = JSON.parse(mod.fs.readFileSync(mod.setting.getValue('server.FILE_LIST_JSON')))
  if (!fileList[emailAddress] || !fileList[emailAddress][owner] || !fileList[emailAddress][owner][filePath]) {
    return false
  }

  delete fileList[emailAddress][owner][filePath]

  mod.fs.writeFileSync(mod.setting.getValue('server.FILE_LIST_JSON'), JSON.stringify(fileList, null, 2))
  return true
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

  updateFile,
  deleteFile,

  endResponse,
}

