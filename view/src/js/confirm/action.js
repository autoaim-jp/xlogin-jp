/* confirm/action.js */
export const getOnSubmitConfirmHandler = ({ getPermissionCheckList, postConfirm, switchLoading, redirect }) => {
  const handler = () => {
    return (event) => {
      event.preventDefault()
      event.stopPropagation()
      switchLoading(true)

      const permissionList = getPermissionCheckList()
      postConfirm({ permissionList }).then((result) => {
        switchLoading(false)
        redirect(result)
      })
    }
  }
  return handler
}

