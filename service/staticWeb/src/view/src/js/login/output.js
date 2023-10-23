/* login/output.js */
export const getPostLogin = ({ apiEndpoint, postRequest }) => {
  const url = `${apiEndpoint}/login/credential/check`
  return ({ emailAddress, passHmac2 }) => {
    const param = { emailAddress, passHmac2 }
    return postRequest(url, param)
  }
}

export const getLoginFormElm = () => {
  const emailAddressInputElm = document.querySelector('#emailAddressInput')
  const passInputElm = document.querySelector('#passInput')
  return { emailAddressInputElm, passInputElm }
}


export const setLoginFormSubmit = ({ onSubmitLogin }) => {
  const loginFormElm = document.querySelector('#loginForm')
  loginFormElm.onsubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onSubmitLogin()
  }
}

