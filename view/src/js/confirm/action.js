/* confirm/action.js */
export const getOnSubmitConfirm = ({
  getPermissionCheckList, postConfirm, switchLoading, redirect,
}) => {
  return () => {
    switchLoading(true)

    const permissionList = getPermissionCheckList()
    postConfirm({ permissionList }).then((result) => {
      switchLoading(false)
      redirect(result)
    })
  }
}

export const getOnClickCheckAllScopeButton = ({
  getPermissionCheckElmList,
}) => {
  return (e) => {
    const permissionCheckElmList = getPermissionCheckElmList()
    permissionCheckElmList.forEach((elm) => {
      elm.checked = true
    })
  }
}

export default {}

