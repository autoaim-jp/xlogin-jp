/* register/app.js */
const asocial = {}
import * as setting from '../setting.js'
asocial.setting = setting
import * as lib from '../lib.js'
asocial.lib = lib

import * as action from './action.js'
asocial.action = action
import * as output from './output.js'
asocial.output = output

/* a is an alias of asocial */
const a = asocial

const loadRegisterForm = () => {
  const postRegister = a.output.getPostRegister(argNamed({
    setting: a.setting.get('apiEndpoint'),
    lib: [ a.lib.postRequest ],
  }))

  const { emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm } = a.output.getRegisterFormElm()

  const onSubmitRegisterHandler = a.action.getOnSubmitRegisterHandler(argNamed({
    setting: a.setting.get('userHmacSecret'),
    elm: { emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm },
    other: { postRegister },
    lib: [ a.lib.calcHmac512, a.lib.genSalt, a.lib.calcPbkdf2, a.lib.buf2Hex, a.lib.switchLoading, a.lib.redirect ],
  }))

  a.output.setRegisterFormSubmit(argNamed({
    handler: { onSubmitRegisterHandler },
  }))
}

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
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

