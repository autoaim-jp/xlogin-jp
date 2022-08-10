/* confirm/output.js */
export const showPermissionLabelList = ({ permissionLabelList, getRandomStr, }) => {
  const confirmForm = document.querySelector('#confirmForm')
  Object.entries(permissionLabelList).forEach(([scope, permission]) => {
    const inputElmId = `permissionCheck_${getRandomStr(16)}`

    const permissionCheckElm = document.querySelector('#permissionCheckTemplate').cloneNode(true)
    permissionCheckElm.classList.remove('hidden')
    permissionCheckElm.setAttribute('id', `${inputElmId}_wrap`)

    const inputElm = permissionCheckElm.querySelector('#permissionCheckTemplateInput')
    inputElm.setAttribute('id', inputElmId)
    inputElm.setAttribute('data-scope', scope)
    if (permission.isRequired) {
      inputElm.setAttribute('required', true)
    }

    const labelElm = permissionCheckElm.querySelector('#permissionCheckTemplateInputLabel')
    labelElm.setAttribute('id', `${inputElmId}_label`)
    labelElm.setAttribute('for', inputElmId)
    labelElm.innerText = permission.label

    confirmForm.insertBefore(permissionCheckElm, confirmForm.children[confirmForm.children.length - 1])
  })
}

export const getPermissionCheckList = () => {
  const permissionCheckList = {}
  Object.values(document.querySelectorAll('[data-scope]')).forEach((elm) => {
    let scope = elm.dataset.scope
    if (scope.length > 0 && scope[0] === '*') {
      scope = scope.slice(1)
    }
    permissionCheckList[scope] = elm.checked
  })
  return permissionCheckList
}

export const getPostConfirm = ({ apiEndpoint, postRequest }) => {
  const url = `${apiEndpoint}/confirm/permission/check`
  return ({ permissionList }) => {
    const param = { permissionList }
    return postRequest(url, param)
  }
}

export const getConfirmFormElm = () => {
  const confirmFormElm = document.querySelector('#confirmForm')
  return confirmFormElm
}


export const setConfirmFormSubmit = ({ confirmFormElm, onSubmitConfirm }) => {
  confirmFormElm.onsubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onSubmitConfirm()
  }
}

