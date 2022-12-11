/* confirm/core.js */

const _convertScopeToLabel = ({ labelList, scope }) => {
  const paramList = scope.split(':')
  if (paramList.length < 2) {
    throw new Error(`invalid scope value: ${scope}`)
  }

  let isRequired = null
  const modeList = []
  if (paramList[0][0] === '*') {
    isRequired = true
    paramList[0] = paramList[0].slice(1)
  } else {
    isRequired = false
  }

  if (paramList[0].indexOf('r') >= 0) {
    modeList.push('read')
  }
  if (paramList[0].indexOf('w') >= 0) {
    modeList.push('write')
  }
  if (paramList[0].indexOf('a') >= 0) {
    modeList.push('append')
  }
  if (modeList.length === 0) {
    throw new Error(`unknown mode: ${paramList[0]}`)
  }

  if (paramList[1] !== 'auth') {
    paramList[1] = 'service'
  }

  const operation = modeList.map((mode) => { return labelList.scope.operation[mode] }).join('と')
  const labelNoWrapList = []
  labelNoWrapList.push(labelList.scope[paramList[1]][paramList[2]])
  if (isRequired) {
    labelNoWrapList.push(`の${operation} (${labelList.scope.other.isRequired})`)
  } else {
    labelNoWrapList.push(`の${operation}`)
  }

  return {
    labelNoWrapList,
    isRequired,
  }
}

export const convertPermissionList = ({ labelList, resultFetchScope }) => {
  if (!resultFetchScope || !resultFetchScope.result || !resultFetchScope.result.scope) {
    throw new Error(`invalid scope value: ${JSON.stringify(resultFetchScope)}`)
  }

  const permissionLabelList = {}

  const scopeList = resultFetchScope.result.scope.split(',')
  if (scopeList.length === 0) {
    return permissionLabelList
  }

  scopeList.forEach((scope) => {
    permissionLabelList[scope] = _convertScopeToLabel({ scope, labelList })
  })

  return permissionLabelList
}

export const checkThrough = ({
  postThrough, notRequiredPermissionListElm, flipSvgElm, updateRequestScope, updateScopeAlreadyChecked, switchLoading, redirect, slideToggle,
}) => {
  switchLoading(true)
  return postThrough().then((result) => {
    switchLoading(false)
    redirect(result)
    updateRequestScope({
      requestScope: result?.result?.requestScope, notRequiredPermissionListElm, flipSvgElm, slideToggle,
    })
    updateScopeAlreadyChecked({
      oldPermissionList: result?.result?.oldPermissionList,
    })

    return result
  })
}

export const checkImportantPermissionWithModal = async ({ permissionList, resultCheckTrough, scopeExtraConfigList, labelList, showModal, getErrorModalElmAndSetter }) => {
  const { modalElm, setContent } = getErrorModalElmAndSetter()
  const oldPermissionList = resultCheckTrough?.result?.oldPermissionList || {}
  for (const [scope, isChecked] of Object.entries(permissionList)) {
    if (!isChecked) {
      continue
    }
    if (oldPermissionList[scope]) {
      continue
    }
    const scopeWithoutOperation= scope.split(':').slice(1).join(':')
    if (!scopeExtraConfigList[scopeWithoutOperation] || !scopeExtraConfigList[scopeWithoutOperation].dialogConfirm) {
      continue
    }

    const { labelNoWrapList } = _convertScopeToLabel({ labelList, scope })
    const label = labelNoWrapList.join('')
    setContent(`[${label}(${scope})]は重要な権限です。本当に許可しますか？`, null, '確認')
    const isAuthorized = await showModal(modalElm, true)
    if (!isAuthorized) {
      return false
    }
  }
  return true
}

