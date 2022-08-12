/* confirm/app.js */
const asocial = {}
import * as setting from '../_setting/index.js'
asocial.setting = setting
import * as lib from '../lib.js'
asocial.lib = lib

import * as input from './input.js'
asocial.input = input
import * as action from './action.js'
asocial.action = action
import * as core from './core.js'
asocial.core = core
import * as output from './output.js'
asocial.output = output
/* a is an alias of asocial */
const a = asocial

const loadPermissionList = async () => {
  const resultFetchScope = await a.input.fetchScope(argNamed({
    setting: a.setting.bsc.get('apiEndpoint'),
    lib: [ a.lib.getRequest ],
  }))

  const permissionLabelList = a.core.convertPermissionList(argNamed({
    setting: a.setting.bsc.get('labelList'),
    other: { resultFetchScope },
  }))

  a.output.showPermissionLabelList(argNamed({
    lib: [ a.lib.getRandomStr ],
    other: { permissionLabelList },
  }))
}

const loadConfirmForm = async () => {
  const postConfirm = a.output.getPostConfirm(argNamed({
    lib: [ a.lib.postRequest ],
    setting: a.setting.bsc.get('apiEndpoint'),
  }))

  const onSubmitConfirm = a.action.getOnSubmitConfirm(argNamed({
    output: [ a.output.getPermissionCheckList ],
    lib: [ a.lib.switchLoading, a.lib.redirect ],
    other: { postConfirm },
  }))

  const confirmFormElm = a.output.getConfirmFormElm()
  a.output.setConfirmFormSubmit(argNamed({
    elm: { confirmFormElm },
    onSubmit: { onSubmitConfirm },
  }))
}

const startThroughCheck = () => {
  const postThrough = a.output.getPostThrough(argNamed({
    lib: [ a.lib.postRequest ],
    setting: a.setting.bsc.get('apiEndpoint'),
  }))
  a.core.checkThrough(argNamed({
    lib: [ a.lib.switchLoading, a.lib.redirect ],
    param: { postThrough },
  }))
}

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
  a.lib.setOnClickNotification(a.setting.bsc.apiEndpoint)
  a.lib.monkeyPatch()

  a.app.loadPermissionList()
  a.app.loadConfirmForm()

  a.app.startThroughCheck()
}

a.app = {
  main,
  loadPermissionList,
  loadConfirmForm,
  startThroughCheck,
}

a.app.main()

