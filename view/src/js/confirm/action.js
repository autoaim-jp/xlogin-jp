/* confirm/action.js */
export const getOnSubmitConfirmHandler = ({ getPermissionCheckList, postConfirm, switchLoading, redirect }) => {
  const handler = () => {
    return (event) => {
      event.preventDefault()
      event.stopPropagation()
      switchLoading(true)

      const permission_list = getPermissionCheckList()
      postConfirm({ permission_list }).then((result) => {
        switchLoading(false)
        redirect(result)
      })
    }
  }
  return handler
}

