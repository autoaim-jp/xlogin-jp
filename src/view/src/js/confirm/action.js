/* confirm/action.js */
export const getOnSubmitConfirm = ({
  getPermissionCheckList, postConfirm, switchLoading, redirect,
  checkImportantPermissionWithModal,
  scopeExtraConfigList, labelList, showModal, getErrorModalElmAndSetter,
  resultCheckTrough,
}) => {
  return async () => {
    switchLoading(true)

    const permissionList = getPermissionCheckList()
    const isAuthorized = await checkImportantPermissionWithModal({ permissionList, resultCheckTrough, scopeExtraConfigList, labelList, showModal, getErrorModalElmAndSetter })
    if (!isAuthorized) {
      switchLoading(false)
      return
    }
    postConfirm({ permissionList }).then((result) => {
      switchLoading(false)
      redirect(result)
    })
  }
}

export const getOnClickCheckAllScopeButton = ({
  getRequiredPermissionCheckElmList,
}) => {
  return () => {
    setTimeout(() => {
      const permissionCheckElmList = getRequiredPermissionCheckElmList()
      permissionCheckElmList.forEach((elm) => {
        elm.checked = true
      })
    }, 300)
  }
}

export const getOnClickShowOptionPermissionBtn = ({
  notRequiredPermissionListElm, flipSvgElm, slideToggle,
}) => {
  return () => {
    slideToggle(notRequiredPermissionListElm, 300, false)
    if (flipSvgElm.classList.contains('flipY')) {
      flipSvgElm.classList.remove('flipY')
    } else {
      flipSvgElm.classList.add('flipY')
    }
  }
}

export default {}

