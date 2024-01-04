/* /common/backend-server/output.js */

const mod = {}

const init = ({ setting }) => {
  mod.setting = setting
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
const endResponse = ({ req, res, handleResult }) => {
  logger.info('endResponse', { 'req.url': req.url, 'handleResult.error': handleResult.error })
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

  endResponse,
}

