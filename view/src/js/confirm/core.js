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
    let mode = ''
    if (paramList[0][0] === '*') {
      isRequired = true
      paramList[0] = paramList[0].slice(1)
    } else {
      isRequired = false
    }

    if (paramList[0].indexOf('r') >= 0) {
      mode = 'read'
    } else if (paramList[0].indexOf('w') >= 0) {
      mode = 'write'
    } else {
      throw new Error(`unknown mode: ${paramList[0]}`)
    }
    
    let label = ''
    if (isRequired) {
      label = `${labelList.scope[mode][paramList[2]]} (${labelList.scope.other.isRequired})`
    } else {
      label = labelList.scope[mode][paramList[2]]
    }

    permissionLabelList[row] = {
      label,
      isRequired,
    }
  })

  return permissionLabelList
}

