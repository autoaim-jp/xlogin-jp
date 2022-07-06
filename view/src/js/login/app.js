/* login/app.js */
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

const loadLoginForm = () => {
  const postLogin = a.output.getPostLogin(argNamed({
    setting: a.setting.get('apiEndpoint'),
    lib: [ a.lib.postRequest ],
  }))

  const { emailAddressInputElm, passInputElm } = a.output.getLoginFormElm()
  const onSubmitLoginHandler = a.action.getOnSubmitLoginHandler(argNamed({
    setting: a.setting.get('userHmacSecret'),
    lib: [ a.lib.calcHmac512, a.lib.switchLoading, a.lib.redirect ],
    other: { emailAddressInputElm, passInputElm, postLogin },
  }))

  a.output.setLoginFormSubmit(argNamed({
    handler: { onSubmitLoginHandler },
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
