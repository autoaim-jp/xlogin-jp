/* /login/action.js */

export const getOnSubmitLoginHandler = ({ calcHmac512, userHmacSecret, emailAddressInputElm, passInputElm, postLogin, redirect, switchLoading, showModal, getErrorModalElmAndSetter }) => {
  const handler = () => {
    const { modalElm, setter } = getErrorModalElmAndSetter()

    return async (event) => {
      event.preventDefault()
      event.stopPropagation()
      switchLoading(true)

      const emailAddress = emailAddressInputElm.value
      const pass = passInputElm.value
      const passHmac1 = await calcHmac512(pass, userHmacSecret)
      const passHmac2 = await calcHmac512(passHmac1, userHmacSecret)
      postLogin({ emailAddress, passHmac2 }).then((result) => {
        switchLoading(false)
        if (result.error) {
          setter(result.error)
          showModal(modalElm, false)
        } else {
          redirect(result)
        }
      })
      return false
    }
  }
  return handler
}

