/* confirm/output.js */
export const showPermissionLabelList = ({ permissionLabelList, getRandomStr }) => {
  const requiredPermissionListElm = document.querySelector('#requiredPermissionList')
  const notRequiredPermissionListElm = document.querySelector('#notRequiredPermissionList')
  Object.entries(permissionLabelList).forEach(([scope, permission]) => {
    const inputElmId = `permissionCheck_${getRandomStr(16)}`
    const wrapElmId = `wrap_${inputElmId}`
    const labelElmId = `label_${inputElmId}`

    const permissionCheckElm = document.querySelector('#permissionCheckTemplate').cloneNode(true)
    permissionCheckElm.classList.remove('hidden')
    permissionCheckElm.setAttribute('id', wrapElmId)

    const inputElm = permissionCheckElm.querySelector('#permissionCheckTemplateInput')
    inputElm.setAttribute('id', inputElmId)
    inputElm.setAttribute('data-scope', scope)
    inputElm.setAttribute('data-scope-is-required', permission.isRequired)
    if (permission.isRequired) {
      inputElm.setAttribute('required', true)
    }

    const labelElm = permissionCheckElm.querySelector('#permissionCheckTemplateInputLabel')
    labelElm.setAttribute('id', labelElmId)
    labelElm.setAttribute('for', inputElmId)
    labelElm.innerText = permission.label

    if (permission.isRequired) {
      requiredPermissionListElm.insertBefore(permissionCheckElm, requiredPermissionListElm.children[requiredPermissionListElm.children.length - 1])
    } else {
      notRequiredPermissionListElm.insertBefore(permissionCheckElm, notRequiredPermissionListElm.children[notRequiredPermissionListElm.children.length - 1])
    }
  })
}

export const updateRequestScope = ({ requestScope, notRequiredPermissionListElm, flipSvgElm, slideToggle }) => {
  const requestScopeInputElm = document.querySelector(`[data-scope="${requestScope}"]`)
  if (!requestScopeInputElm) {
    return
  }
  requestScopeInputElm.parentNode.classList.add('bg-red-400')
  slideToggle(notRequiredPermissionListElm, 300, true)
  if (!flipSvgElm.classList.contains('flipY')) {
    flipSvgElm.classList.add('flipY')
  }
}

export const getPermissionCheckList = () => {
  const permissionCheckList = {}
  Object.values(document.querySelectorAll('[data-scope]')).forEach((elm) => {
    let { scope } = elm.dataset
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

export const getPostThrough = ({ apiEndpoint, postRequest }) => {
  const url = `${apiEndpoint}/confirm/through/check`
  return () => {
    const param = {}
    return postRequest(url, param)
  }
}

export const getRequiredPermissionCheckElmList = () => {
  const permissionCheckElmList = Object.values(document.querySelectorAll('[data-scope-is-required="true"]'))
  return permissionCheckElmList
}


export const setOnCheckAllScopeButton = ({ onClickCheckAllScopeButton }) => {
  const checkAllScopeBtnElm = document.querySelector('#checkAllScopeBtn')
  checkAllScopeBtnElm.onclick = onClickCheckAllScopeButton
}


export const getAccordionElm = () => {
  const notRequiredPermissionListElm = document.querySelector('#notRequiredPermissionList')
  const flipSvgElm = document.querySelector('#showOptionPermissionBtn svg')
  const showOptionPermissionBtnElm = document.querySelector('#showOptionPermissionBtn')
  return { notRequiredPermissionListElm, flipSvgElm, showOptionPermissionBtnElm }
}

export const setOnClickShowOptionPermissionBtn = ({
  showOptionPermissionBtnElm, onClickShowOptionPermissionBtn, notRequiredPermissionListElm,
}) => {
  showOptionPermissionBtnElm.onclick = onClickShowOptionPermissionBtn
  notRequiredPermissionListElm.onclick = (e) => {
    e.stopPropagation()
  }
}
