/* _setting/index.js */
import browserServerSetting from './browserServerSetting.js'

const userHmacSecret = 'xlogin20220630'
const scopeExtraConfigList = {
  'auth:backupEmailAddress': {
    templateId: '#permissionCheckBlackTemplate',
    dialogConfirm: true,
  },
}

const setting = {
  userHmacSecret,
  scopeExtraConfigList,
}

export const getList = (...keyList) => {
  /* eslint-disable no-param-reassign */
  const constantList = keyList.reduce((prev, key) => {
    let value = setting
    for (const keySplit of key.split('.')) {
      value = value[keySplit]
    }
    prev[key.slice(key.lastIndexOf('.') + 1)] = value
    return prev
  }, {})
  for (const key of keyList) {
    if (constantList[key.slice(key.lastIndexOf('.') + 1)] === undefined) {
      throw new Error(`[error] undefined setting constant: ${key}`)
    }
  }
  return constantList
}


export const getValue = (key) => {
  let value = setting
  for (const keySplit of key.split('.')) {
    value = value[keySplit]
  }
  return value
}

export default {
  getList,
  getValue,
  browserServerSetting,
}

