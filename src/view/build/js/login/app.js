/* login/app.js */
import * as setting from '../_setting/index.js'
import * as lib from '../lib.js'

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
    lib: [a.lib.postRequest],
  }))

  const { emailAddressInputElm, passInputElm } = a.output.getLoginFormElm()
  const onSubmitLogin = a.action.getOnSubmitLogin(argNamed({
    browserServerSetting: a.setting.bsc.get('labelList'),
    setting: a.setting.get('userHmacSecret'),
    lib: [a.lib.calcHmac512, a.lib.switchLoading, a.lib.redirect, a.lib.showModal, a.lib.getErrorModalElmAndSetter],
    other: { emailAddressInputElm, passInputElm, postLogin },
  }))

  a.output.setLoginFormSubmit(argNamed({
    onSubmit: { onSubmitLogin },
  }))
}

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
  a.lib.setOnClickNotification(a.setting.bsc.apiEndpoint)
  a.lib.monkeyPatch()

  a.app.loadLoginForm()

  setTimeout(() => {
    a.lib.switchLoading(false)
  }, 300)
}

a.app = {
  main,
  loadLoginForm,
}

a.app.main()

