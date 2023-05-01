/* index/app.js */
import * as setting from '../_setting/index.js'
import * as lib from '../_lib/index.js'

const asocial = {}
asocial.setting = setting
asocial.lib = lib
/* a is an alias of asocial */
const a = asocial

const main = async () => {
  a.lib.xdevkit.output.switchLoading(true)
  a.lib.common.output.setOnClickNavManu()
  a.lib.common.output.setOnClickNotification(a.setting.bsc.apiEndpoint, a.lib.xdevkit.output.applyElmList, a.lib.common.input.getRequest)
  a.lib.monkeyPatch()
  setTimeout(() => {
    a.lib.xdevkit.output.switchLoading(false)
  }, 300)
}

a.app = {
  main,
}

a.app.main()

