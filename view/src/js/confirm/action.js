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

export default {}

