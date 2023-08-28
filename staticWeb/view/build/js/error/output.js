/* error/output.js */
export const showErrorModal = ({
  getSearchQuery, getErrorModalElmAndSetter, showModal, labelList,
}) => {
  const errorKey = getSearchQuery().error
  const { modalElm, setContent } = getErrorModalElmAndSetter()
  setContent(errorKey, labelList.error)
  showModal(modalElm)
}

export default {}

