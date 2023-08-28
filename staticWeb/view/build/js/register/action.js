export const getOnSubmitRegister = ({
  userHmacSecret, labelList, emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm, calcHmac512, genSalt, calcPbkdf2, buf2Hex, switchLoading, redirect, postRegister, getErrorModalElmAndSetter, showModal,
}) => {
  const { modalElm, setContent } = getErrorModalElmAndSetter()

  return async () => {
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

    postRegister({
      emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked,
    }).then((result) => {
      switchLoading(false)
      if (result.error) {
        setContent(result.error, labelList.error)
        showModal(modalElm, false)
      } else {
        redirect(result)
      }
    })
  }
}

export default {}

