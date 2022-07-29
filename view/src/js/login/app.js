/* login/app.js */
const asocial = {}
import * as setting from '../_setting/index.js'
asocial.setting = setting
import * as lib from '../lib.js'
asocial.lib = lib

import * as action from './action.js'
asocial.action = action
import * as output from './output.js'
asocial.output = output

/* a is an alias of asocial */
const a = asocial

const loadLoginForm = () => {
  const postLogin = a.output.getPostLogin(argNamed({
    browserServerSetting: a.setting.getBrowserServerSetting().get('apiEndpoint'),
    lib: [ a.lib.postRequest ],
  }))

  const { emailAddressInputElm, passInputElm } = a.output.getLoginFormElm()
  const onSubmitLogin = a.action.getOnSubmitLogin(argNamed({
    browserServerSetting: a.setting.getBrowserServerSetting().get('labelList'),
    setting: a.setting.get('userHmacSecret'),
    lib: [ a.lib.calcHmac512, a.lib.switchLoading, a.lib.redirect, a.lib.showModal, a.lib.getErrorModalElmAndSetter ],
    other: { emailAddressInputElm, passInputElm, postLogin },
  }))

  a.output.setLoginFormSubmit(argNamed({
    onSubmit: { onSubmitLogin },
  }))
}

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
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

