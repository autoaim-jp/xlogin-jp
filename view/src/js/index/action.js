/* /index/action.js */
export const getOnClickSaveMemoHandler = ({ memoContentElmAndGetter, postSaveMemoContent, apiEndpoint, postRequest, getInfoModalSaveMemoElm, showModal, switchLoading, }) => {
  const handler = (boardLabel) => {
    const modalElm = getInfoModalSaveMemoElm()
    return (event) => {
      event.stopPropagation()
      switchLoading(true)
      const { memoContent, } = memoContentElmAndGetter.getter()
      postSaveMemoContent({ memoContent, apiEndpoint, postRequest, }).then(() => {
        showModal(modalElm, false, null)
        switchLoading(false)
      })
    }
  }
  return handler
}

export const getOnClickClearMemoHandler = ({ postClearMemoContent, apiEndpoint, postRequest, loadMemoContent, getConfirmModalClearMemoElm, showModal, switchLoading, }) => {
  const handler = () => {
    const modalElm = getConfirmModalClearMemoElm()
    const onConfirm = async () => {
      switchLoading(true)
      await postClearMemoContent({ apiEndpoint, postRequest, })
      await loadMemoContent()
      switchLoading(false)
    }
    return (event) => {
      event.stopPropagation()
      showModal(modalElm, true, onConfirm)
    }
  }
  return handler
}

