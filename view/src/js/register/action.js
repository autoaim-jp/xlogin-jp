export const getOnSubmitRegisterHandler = ({ userHmacSecret, emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm, calcHmac512, genSalt, calcPbkdf2, buf2Hex, switchLoading, redirect, postRegister, getErrorModalElmAndSetter, showModal }) => {
  const handler = () => {
    const { modalElm, setter } = getErrorModalElmAndSetter()

    return async (event) => {
      event.preventDefault()
      event.stopPropagation()
      switchLoading(true)

      const emailAddress = emailAddressInputElm.value
      const pass = passInputElm.value
      const isTosChecked = tosCheckElm.checked
      const isPrivacyPolicyChecked = privacyPolicyCheckElm.checked

      const passHmac1 = await calcHmac512(pass, userHmacSecret)
      const passHmac2 = await calcHmac512(passHmac1, userHmacSecret)
      const salt = genSalt()
      const passPbkdf2 = await calcPbkdf2(passHmac2, salt)
      const saltHex = buf2Hex(salt)

      postRegister({ emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked }).then((result) => {
        switchLoading(false)
        if (result.error) {
          setter(result.error)
          showModal(modalElm, false)
        } else {
          redirect(result)
        }
      })
    }
  }
  return handler
}

