export const getOnSubmitRegisterHandler = ({ userHmacSecret, emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm, calcHmac512, genSalt, calcPbkdf2, buf2Hex, switchLoading, redirect, postRegister }) => {
  const handler = () => {
    return async (event) => {
      event.preventDefault()
      event.stopPropagation()
      switchLoading(true)

      const emailAddress = emailAddressInputElm.value
      const pass = passInputElm.value
      const tosChecked = tosCheckElm.value
      const privacyPolicyChecked = privacyPolicyCheckElm.value

      const passHmac1 = await calcHmac512(pass, userHmacSecret)
      const passHmac2 = await calcHmac512(passHmac1, userHmacSecret)
      const salt = genSalt()
      const passPbkdf2 = await calcPbkdf2(passHmac2, salt)
      const saltHex = buf2Hex(salt)

      postRegister({ emailAddress, passPbkdf2, saltHex, tosChecked, privacyPolicyChecked }).then((result) => {
        switchLoading(false)
        console.log(emailAddress, passPbkdf2, saltHex, tosChecked, privacyPolicyChecked, result)
//        redirect(result)
      })
    }
  }
  return handler
}

