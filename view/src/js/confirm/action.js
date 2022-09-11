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

export const getOnClickShowOptionPermissionBtn = ({
  notRequiredPermissionListElm, flipSvgElm, showOptionPermissionBtnElm, slideToggle
}) => {
  return (e) => {
    slideToggle(notRequiredPermissionListElm, 300)
    if (flipSvgElm.classList.contains('flipY')) {
      flipSvgElm.classList.remove('flipY')
    } else {
      flipSvgElm.classList.add('flipY')
    }
  }
}

export default {}

