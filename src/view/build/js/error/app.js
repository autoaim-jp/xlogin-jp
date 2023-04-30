/* error/app.js */
import * as setting from '../_setting/index.js'
import * as lib from '../lib.js'

import * as output from './output.js'

const asocial = {}
asocial.setting = setting
asocial.lib = lib
asocial.output = output

/* a is an alias of asocial */
const a = asocial

const loadErrorMessage = () => {
  a.output.showErrorModal(argNamed({
    lib: [a.lib.getSearchQuery, a.lib.getErrorModalElmAndSetter, a.lib.showModal],
    setting: a.setting.bsc.get('labelList'),
  }))
}

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
  a.lib.setOnClickNotification(a.setting.bsc.apiEndpoint)
  a.lib.monkeyPatch()

  a.app.loadErrorMessage()

  setTimeout(() => {
    a.lib.switchLoading(false)
  }, 300)
}

a.app = {
  main,
  loadErrorMessage,
}

a.app.main()

