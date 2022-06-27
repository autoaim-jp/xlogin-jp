/* index/app.js */
const asocial = {}
import * as action from './action.js'
asocial.action = action
import * as core from './core.js'
asocial.core = core
import * as output from './output.js'
asocial.output = output
import * as input from './input.js'
asocial.input = input
import * as setting from '../setting.js'
asocial.setting = setting
import * as lib from '../lib.js'
asocial.lib = lib
/* a is an alias of asocial */
const a = asocial

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
  a.lib.monkeyPatch()
//  await a.app.loadMemoContent()
  setTimeout(() => {
    a.lib.switchLoading(false)
  }, 300)
}

const loadMemoContent = async () => {
  /* [input] fetch data from server */
  /*
  const memoContent = await a.input.fetchMemoContent(argNamed({
    setting: a.setting.get('apiEndpoint'),
    lib: [a.lib.getRequest],
  }))
    */
  const memoContent = await a.input.fetchMemoContent(argNamed({
    setting: a.setting.get('apiEndpoint'),
    lib: [ a.lib.getRequest ],
  }))
  a.lib.debug('memoContent', memoContent)

  /* [output] get element of output data */
  const memoContentElmAndGetter = a.output.getMemoContentElmAndGetter(argNamed({
    other: { memoContent, },
  }))
  a.lib.debug('memoContentElmAndGetter', memoContentElmAndGetter)

  /* [action] get onClick handler */
  const onClickSaveMemoHandler = a.action.getOnClickSaveMemoHandler(argNamed({
    setting: a.setting.get('apiEndpoint'),
    output: [ a.output.postSaveMemoContent, a.output.getInfoModalSaveMemoElm, ],
    lib: [ a.lib.postRequest, a.lib.showModal, a.lib.switchLoading, ],
    other: { memoContentElmAndGetter, },
  }))
  const onClickClearMemoHandler = a.action.getOnClickClearMemoHandler(argNamed({
    setting: a.setting.get('apiEndpoint'),
    app: [ a.app.loadMemoContent, ],
    output: [ a.output.postClearMemoContent, a.output.getConfirmModalClearMemoElm, ],
    lib: [ a.lib.postRequest, a.lib.showModal, a.lib.switchLoading, ],
  }))

  /* [output] show element */
  a.output.showMemoContentElm(argNamed({
    elm: { memoContentElmAndGetter, },
  }))
  a.output.setSaveMemoButton(argNamed({
    handler: { onClickSaveMemoHandler, },
  }))
  a.output.setClearMemoButton(argNamed({
    handler: { onClickClearMemoHandler, }
  }))
  a.lib.log('loaded')
}

a.app = {
  main,
  loadMemoContent,
}

a.app.main()

