/* register/app.js */
import setting from '../_setting/index.js'
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

const loadRegisterForm = () => {
  const postRegister = a.output.getPostRegister(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('apiEndpoint'),
    lib: [a.lib.common.output.postRequest],
  }))

  const {
    emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm,
  } = a.output.getRegisterFormElm()

  const onSubmitRegister = a.action.getOnSubmitRegister(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('labelList'),
    setting: a.setting.getList('userHmacSecret'),
    elm: {
      emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm,
    },
    other: { postRegister },
    lib: [a.lib.calcHmac512, a.lib.genSalt, a.lib.calcPbkdf2, a.lib.buf2Hex, a.lib.xdevkit.output.switchLoading, a.lib.redirect, a.lib.xdevkit.output.showModal, a.lib.xdevkit.output.getErrorModalElmAndSetter],
  }))

  a.output.setRegisterFormSubmit(argNamed({
    onSubmit: { onSubmitRegister },
  }))
}

const main = async () => {
  a.lib.xdevkit.output.switchLoading(true)
  a.lib.common.output.setOnClickNavManu()
  a.lib.common.output.setOnClickNotification(a.setting.browserServerSetting.getValue('apiEndpoint'), a.lib.xdevkit.output.applyElmList, a.lib.common.input.getRequest, a.lib.xdevkit.output.showModal)
  a.lib.monkeyPatch()

  a.app.loadRegisterForm()

  setTimeout(() => {
    a.lib.xdevkit.output.switchLoading(false)
  }, 300)
}

a.app = {
  loadRegisterForm,
  main,
}

a.app.main()

