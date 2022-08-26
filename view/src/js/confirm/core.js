/* confirm/core.js */
export const convertPermissionList = ({ labelList, resultFetchScope }) => {
  if (!resultFetchScope || !resultFetchScope.result || !resultFetchScope.result.scope) {
    throw new Error(`invalid scope value: ${JSON.stringify(resultFetchScope)}`)
  }

  const permissionLabelList = {}

  const scopeList = resultFetchScope.result.scope.split(',')
  if (scopeList.length === 0) {
    return permissionLabelList
  }

  scopeList.forEach((row) => {
    const paramList = row.split(':')
    if (paramList.length < 2) {
      throw new Error(`invalid scope value: ${row}`)
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

    let label = ''
    const operation = modeList.map((mode) => { return labelList.scope.operation[mode] }).join('と')
    if (isRequired) {
      label = `${labelList.scope[paramList[1]][paramList[2]]}の${operation} (${labelList.scope.other.isRequired})`
    } else {
      label = `${labelList.scope[paramList[1]][paramList[2]]}の${operation}`
    }

    permissionLabelList[row] = {
      label,
      isRequired,
    }
  })

  return permissionLabelList
}

export const checkThrough = ({ postThrough, switchLoading, redirect }) => {
  switchLoading(true)
  postThrough().then((result) => {
    switchLoading(false)
    redirect(result)
  })
}
