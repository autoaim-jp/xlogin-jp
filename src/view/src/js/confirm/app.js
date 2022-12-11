/* confirm/app.js */
import * as setting from '../_setting/index.js'
import * as lib from '../lib.js'

import * as input from './input.js'
import * as action from './action.js'
import * as core from './core.js'
import * as output from './output.js'

const asocial = {}
asocial.setting = setting
asocial.lib = lib
asocial.input = input
asocial.action = action
asocial.core = core
asocial.output = output
/* a is an alias of asocial */
const a = asocial

const loadAllPermissionList = async () => {
  const resultFetchScope = await a.input.fetchScope(argNamed({
    setting: a.setting.bsc.get('apiEndpoint'),
    lib: [a.lib.getRequest],
  }))

  const permissionLabelList = a.core.convertPermissionList(argNamed({
    setting: a.setting.bsc.get('labelList'),
    other: { resultFetchScope },
  }))

  a.output.showPermissionLabelList(argNamed({
    setting: a.setting.get('scopeExtraConfigList'),
    lib: [a.lib.getRandomStr],
    other: { permissionLabelList },
  }))
}

const loadConfirmForm = ({ resultCheckTrough }) => {
  const postConfirm = a.output.getPostConfirm(argNamed({
    lib: [a.lib.postRequest],
    setting: a.setting.bsc.get('apiEndpoint'),
  }))

  const onSubmitConfirm = a.action.getOnSubmitConfirm(argNamed({
    output: [a.output.getPermissionCheckList],
    core: [a.core.checkImportantPermissionWithModal],
    setting: a.setting.get('scopeExtraConfigList'),
    setting2: a.setting.bsc.get('labelList'),
    lib: [a.lib.switchLoading, a.lib.redirect, a.lib.showModal, a.lib.getErrorModalElmAndSetter],
    other: { postConfirm, resultCheckTrough },
  }))

  const confirmFormElm = a.output.getConfirmFormElm()
  a.output.setConfirmFormSubmit(argNamed({
    elm: { confirmFormElm },
    onSubmit: { onSubmitConfirm },
  }))
}

const loadCheckAllScopeButton = () => {
  const onClickCheckAllScopeButton = a.action.getOnClickCheckAllScopeButton(argNamed({
    output: [a.output.getRequiredPermissionCheckElmList],
  }))

  a.output.setOnCheckAllScopeButton(argNamed({
    onClick: { onClickCheckAllScopeButton },
  }))
}

const startThroughCheck = async () => {
  const postThrough = a.output.getPostThrough(argNamed({
    lib: [a.lib.postRequest],
    setting: a.setting.bsc.get('apiEndpoint'),
  }))

  const { notRequiredPermissionListElm, flipSvgElm } = a.output.getAccordionElm()
  const resultCheckTrough = a.core.checkThrough(argNamed({
    param: { postThrough, notRequiredPermissionListElm, flipSvgElm },
    output: [a.output.updateRequestScope, a.output.updateScopeAlreadyChecked],
    lib: [a.lib.switchLoading, a.lib.redirect, a.lib.slideToggle],
  }))

  return resultCheckTrough
}

const loadNotRequiredPermissionListAccordion = async () => {
  const { notRequiredPermissionListElm, flipSvgElm, showOptionPermissionBtnElm } = a.output.getAccordionElm()

  const onClickShowOptionPermissionBtn = a.action.getOnClickShowOptionPermissionBtn(argNamed({
    elm: { notRequiredPermissionListElm, flipSvgElm },
    lib: [a.lib.slideToggle],
  }))

  a.output.setOnClickShowOptionPermissionBtn(argNamed({
    elm: { notRequiredPermissionListElm, showOptionPermissionBtnElm },
    onClick: { onClickShowOptionPermissionBtn },
  }))
}

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
  a.lib.setOnClickNotification(a.setting.bsc.apiEndpoint)
  a.lib.monkeyPatch()

  await a.app.loadAllPermissionList()
  a.app.loadCheckAllScopeButton()

  await a.app.loadNotRequiredPermissionListAccordion()
  const resultCheckTrough = await a.app.startThroughCheck()
  a.app.loadConfirmForm({ resultCheckTrough })
}

a.app = {
  main,
  loadAllPermissionList,
  loadConfirmForm,
  loadCheckAllScopeButton,
  loadNotRequiredPermissionListAccordion,
  startThroughCheck,
}

a.app.main()

