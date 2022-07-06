/* register/output.js */

export const getPostRegister = ({ apiEndpoint, postRequest }) => {
  const url = apiEndpoint + '/login/user/add'
  return ({ emailAddress, passPbkdf2, saltHex, tosChecked, privacyPolicyChecked }) => {
    const param = { emailAddress, passPbkdf2, saltHex, tosChecked, privacyPolicyChecked }
    return postRequest(url, param)
  }
}

export const getRegisterFormElm = () => {
  const emailAddressInputElm = document.querySelector('#emailAddressInput')
  const passInputElm = document.querySelector('#passInput')
  const tosCheckElm = document.querySelector('#tosCheck')
  const privacyPolicyCheckElm = document.querySelector('#privacyPolicyCheck')

  return { emailAddressInputElm, passInputElm, tosCheckElm, privacyPolicyCheckElm }
}

export const setRegisterFormSubmit = ({ onSubmitRegisterHandler }) => {
  const registerFormElm = document.querySelector('#registerForm')
  registerFormElm.onsubmit = onSubmitRegisterHandler()
}

