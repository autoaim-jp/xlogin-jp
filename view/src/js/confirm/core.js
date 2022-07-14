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
    if (row.length === 0) {
      throw new Error(`invalid scope value: ${row}`)
    }

    let key = row
    let isRequired = null
    let mode = ''
    if (key[0] === '*') {
      isRequired = true
      key = key.slice('*'.length)
    } else {
      isRequired = false
    }

    if (key.indexOf('r:') >= 0) {
      mode = 'read'
      key = key.slice('r:'.length)
    } else if (key.indexOf('w:') >= 0) {
      mode = 'write'
      key = key.slice('w:'.length)
    } else {
      throw new Error(`unknown mode: ${key[0]} (${row})`)
    }

    let label = ''
    if (isRequired) {
      label = `${labelList.scope[mode][key]} (${labelList.scope.other.isRequired})`
    } else {
      label = labelList.scope[mode][key]
    }

    permissionLabelList[row] = {
      label,
      isRequired,
    }
  })

  return permissionLabelList
}

