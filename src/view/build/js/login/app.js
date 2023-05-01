/* login/app.js */
import * as setting from '../_setting/index.js'
import * as lib from '../_lib/index.js'

import * as action from './action.js'
import * as output from './output.js'

const asocial = {}
asocial.setting = setting
asocial.lib = lib
asocial.action = action
asocial.output = output

/* a is an alias of asocial */
const a = asocial

const loadLoginForm = () => {
  const postLogin = a.output.getPostLogin(argNamed({
    browserServerSetting: a.setting.bsc.get('apiEndpoint'),
    lib: [a.lib.common.output.postRequest],
  }))

  const { emailAddressInputElm, passInputElm } = a.output.getLoginFormElm()
  const onSubmitLogin = a.action.getOnSubmitLogin(argNamed({
    browserServerSetting: a.setting.bsc.get('labelList'),
    setting: a.setting.get('userHmacSecret'),
    lib: [a.lib.calcHmac512, a.lib.xdevkit.output.switchLoading, a.lib.redirect, a.lib.xdevkit.output.showModal, a.lib.xdevkit.output.getErrorModalElmAndSetter],
    other: { emailAddressInputElm, passInputElm, postLogin },
  }))

  a.output.setLoginFormSubmit(argNamed({
    onSubmit: { onSubmitLogin },
  }))
}

const main = async () => {
  a.lib.xdevkit.output.switchLoading(true)
  a.lib.common.output.setOnClickNavManu()
  a.lib.common.output.setOnClickNotification(a.setting.bsc.apiEndpoint, a.lib.xdevkit.output.applyElmList)
  a.lib.monkeyPatch()

  a.app.loadLoginForm()

  setTimeout(() => {
    a.lib.xdevkit.output.switchLoading(false)
  }, 300)
}

a.app = {
  main,
  loadLoginForm,
}

a.app.main()

