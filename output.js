/* /output.js */
const mod = {}
const init = (setting) => {
  mod.setting = setting
}

const endResponse = (req, res, handleResult) => {
  console.log('endResponse:', req.url, handleResult.error)
  req.session.auth = handleResult.session

  if (handleResult.response) {
    return res.json(handleResult.response)
  } else {
    if (req.method === 'GET') {
      if (handleResult.redirect) {
        return res.redirect(handleResult.redirect)
      } else {
        return res.redirect(mod.setting.url.ERROR_PAGE)
      }
    } else {
      if (handleResult.redirect) {
        return res.json({ redirect: handleResult.redirect })
      } else {
        return res.json({ redirect: mod.setting.url.ERROR_PAGE })
      }
    }
  }
}

export default {
  init,
  endResponse,
}

