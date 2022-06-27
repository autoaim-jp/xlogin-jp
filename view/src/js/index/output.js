/* index/output.js */  
export const postSaveMemoContent = ({ memoContent, apiEndpoint, postRequest, }) => {
  const url = apiEndpoint + '/index/saveMemoContent'
  const param = { memoContent, }
  return postRequest(url, param)
}
export const postClearMemoContent = ({ apiEndpoint, postRequest, }) => {
  const url = apiEndpoint + '/index/clearMemoContent'
  const param = {}
  return postRequest(url, param)
}

const modalTemplateElm = document.querySelector('#modalTemplate')

export const getInfoModalSaveMemoElm = () => {
  const modalElm = modalTemplateElm.cloneNode(true)
  modalElm.id = ''

  modalElm.querySelector('[data-id="modalTitle"]').innerText = '完了'

  const labelP = document.createElement('p')
  labelP.innerText = '更新が完了しました。'
  modalElm.querySelector('[data-id="modalContent"]').appendChild(labelP)

  return modalElm
}

export const getConfirmModalClearMemoElm = () => {
  const modalElm = modalTemplateElm.cloneNode(true)
  modalElm.id = ''

  modalElm.querySelector('[data-id="modalTitle"]').innerText = '確認'

  const labelP = document.createElement('p')
  labelP.innerText = 'メモ内容を全て削除しますか？'
  modalElm.querySelector('[data-id="modalContent"]').appendChild(labelP)

  return modalElm
}

export const getMemoContentElmAndGetter = ({ memoContent, }) => {
  const elmAndGetter = { elm: null, getter: null, }

  const memoTextarea = document.createElement('textarea')
  elmAndGetter.elm = memoTextarea
  memoTextarea.classList.add('w-full', 'h-96', 'p-1')
  memoTextarea.value = memoContent

  const getter = () => {
    return { memoContent: memoTextarea.value, }
  }
  elmAndGetter.getter = getter

  return elmAndGetter
}

export const showMemoContentElm = ({ memoContentElmAndGetter, }) => {
  const memoContentWrapElm = document.querySelector('#memoContentWrap')
  memoContentWrapElm.clearChildren()
  memoContentWrapElm.appendChild(memoContentElmAndGetter.elm)
}

export const setSaveMemoButton = ({ onClickSaveMemoHandler, }) => {
  const saveMemoButton = document.querySelector('#saveMemoButton')
  saveMemoButton.onclick = onClickSaveMemoHandler()
}

export const setClearMemoButton = ({ onClickClearMemoHandler, }) => {
  const saveMemoButton = document.querySelector('#clearMemoButton')
  saveMemoButton.onclick = onClickClearMemoHandler()
}


