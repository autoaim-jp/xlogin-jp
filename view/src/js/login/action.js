/* /login/action.js */

export const getOnSubmitLoginHandler = ({ calcHmac512, userHmacSecret, emailAddressInputElm, passInputElm, postLogin, redirect, switchLoading }) => {
  const handler = () => {
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
        redirect(result)
      })
      return false
    }
  }
  return handler
}

