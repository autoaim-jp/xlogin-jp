import { handleConnect } from './login/handleConnect.js'
import { handleCredentialCheck } from './login/handleCredentialCheck.js'
import { handleConfirm } from './login/handleConfirm.js'
import { handleCode } from './login/handleCode.js'
import { handleThroughReturnNotFound, handleThroughReturnRedirect } from './login/handleThrough.js'

import { handleUserAdd } from './login/handleUserAdd.js'

import { handleUserInfo } from './login/handleUserInfo.js'

export default {
  handleConnect,
  handleCredentialCheck,
  handleConfirm,
  handleCode,
  handleThroughReturnNotFound,
  handleThroughReturnRedirect,

  handleUserAdd,

  handleUserInfo,
}

