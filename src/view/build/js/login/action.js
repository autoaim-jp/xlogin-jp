/* login/action.js */

export const getOnSubmitLogin = ({
  calcHmac512, userHmacSecret, labelList, emailAddressInputElm, passInputElm, postLogin, redirect, switchLoading, showModal, getErrorModalElmAndSetter,
}) => {
  const { modalElm, setContent } = getErrorModalElmAndSetter()

  return async () => {
    switchLoading(true)

    const emailAddress = emailAddressInputElm.value
    const pass = passInputElm.value
    const passHmac1 = await calcHmac512(pass, userHmacSecret)
    const passHmac2 = await calcHmac512(passHmac1, userHmacSecret)
    postLogin({ emailAddress, passHmac2 }).then((result) => {
      switchLoading(false)
      if (result.error) {
        setContent(result.error, labelList.error)
        showModal(modalElm, false)
      } else {
        redirect(result)
      }
    })
    return false
  }
}

export default {}

