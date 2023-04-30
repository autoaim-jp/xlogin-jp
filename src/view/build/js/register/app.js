/* register/app.js */
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

const loadRegisterForm = () => {
  const postRegister = a.output.getPostRegister(argNamed({
    browserServerSetting: a.setting.bsc.get('apiEndpoint'),
    lib: [a.lib.postRequest],
  }))

  const {
    emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm,
  } = a.output.getRegisterFormElm()

  const onSubmitRegister = a.action.getOnSubmitRegister(argNamed({
    browserServerSetting: a.setting.bsc.get('labelList'),
    setting: a.setting.get('userHmacSecret'),
    elm: {
      emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm,
    },
    other: { postRegister },
    lib: [a.lib.calcHmac512, a.lib.genSalt, a.lib.calcPbkdf2, a.lib.buf2Hex, a.lib.switchLoading, a.lib.redirect, a.lib.showModal, a.lib.getErrorModalElmAndSetter],
  }))

  a.output.setRegisterFormSubmit(argNamed({
    onSubmit: { onSubmitRegister },
  }))
}

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
  a.lib.setOnClickNotification(a.setting.bsc.apiEndpoint)
  a.lib.monkeyPatch()

  a.app.loadRegisterForm()

  setTimeout(() => {
    a.lib.switchLoading(false)
  }, 300)
}

a.app = {
  loadRegisterForm,
  main,
}

a.app.main()

