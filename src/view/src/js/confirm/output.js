/* confirm/output.js */
export const showPermissionLabelList = ({
  permissionLabelList, getRandomStr, scopeExtraConfigList, onClickScopeDetailBtn,
}) => {
  const requiredPermissionListElm = document.querySelector('#requiredPermissionList')
  const notRequiredPermissionListElm = document.querySelector('#notRequiredPermissionList')
  const permissionCheckDetailButtonTemplateElm = document.querySelector('#permissionCheckDetailButtonTemplate')
  Object.entries(permissionLabelList).forEach(([scope, permission]) => {
    const inputElmId = `permissionCheck_${getRandomStr(16)}`
    const wrapElmId = `wrap_${inputElmId}`

    const scopeWithoutOperation = scope.split(':').slice(1).join(':')
    const scopeExtraConfig = scopeExtraConfigList[scopeWithoutOperation]
    let permissionCheckElm = null
    if (scopeExtraConfig && scopeExtraConfig.templateId) {
      permissionCheckElm = document.querySelector(scopeExtraConfig.templateId).cloneNode(true)
    } else {
      permissionCheckElm = document.querySelector('#permissionCheckTemplate').cloneNode(true)
    }
    permissionCheckElm.classList.remove('hidden')
    permissionCheckElm.setAttribute('id', wrapElmId)

    const inputElm = permissionCheckElm.querySelector('[data-id="permissionCheckTemplateInput"]')
    inputElm.setAttribute('data-scope', scope)
    inputElm.setAttribute('id', inputElmId)

    inputElm.setAttribute('data-scope-is-required', permission.isRequired)
    if (permission.isRequired) {
      inputElm.setAttribute('required', true)
    }

    const labelElm = permissionCheckElm.querySelector('[data-id="permissionCheckTemplateInputLabel"]')
    labelElm.setAttribute('for', inputElmId)
    permission.labelNoWrapList.forEach((label) => {
      const noWrapElm = document.createElement('span')
      noWrapElm.classList.add('whitespace-nowrap')
      noWrapElm.innerText = label
      labelElm.appendChild(noWrapElm)
    })

    const btnElm = permissionCheckElm.querySelector('[data-id="permissionCheckTemplateDetailBtn"]')
    btnElm.onclick = (e) => {
      e.preventDefault()
      const summaryWrapElm = document.createElement('div')
      summaryWrapElm.appendChild(document.createTextNode(permission.summary))
      const summaryLinkElm = permissionCheckDetailButtonTemplateElm.cloneNode(true)
      summaryLinkElm.setAttribute('href', `/scopeDetail#${scopeWithoutOperation}`)
      summaryLinkElm.classList.remove('hidden')
      summaryWrapElm.appendChild(summaryLinkElm)
      onClickScopeDetailBtn('権限の説明', summaryWrapElm)
    }

    if (permission.isRequired) {
      requiredPermissionListElm.insertBefore(permissionCheckElm, requiredPermissionListElm.children[requiredPermissionListElm.children.length - 1])
    } else {
      notRequiredPermissionListElm.insertBefore(permissionCheckElm, notRequiredPermissionListElm.children[notRequiredPermissionListElm.children.length - 1])
    }
  })
}

export const updateRequestScope = ({
  requestScope, notRequiredPermissionListElm, flipSvgElm, slideToggle,
}) => {
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

export const updateScopeAlreadyChecked = ({ oldPermissionList }) => {
  Object.values(document.querySelectorAll('[data-scope]')).forEach((elm) => {
    let { scope } = elm.dataset
    if (scope.length > 0 && scope[0] === '*') {
      scope = scope.slice(1)
    }

    if (oldPermissionList[scope]) {
      elm.checked = true
    }
  })
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

