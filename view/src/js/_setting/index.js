/* _setting/index.js */
import * as browserServerSetting from './browserServerSetting.js'

export const userHmacSecret = 'xlogin20220630'
export const scopeColorClassList = {
  'auth:backupEmailAddress': ['bg-black', 'text-white']
}

export const bsc = browserServerSetting

const settingList = {
  userHmacSecret,
  scopeColorClassList,
}

export const getBrowserServerSetting = () => {
  return browserServerSetting
}

export const get = (...keyList) => {
  /* eslint-disable no-param-reassign */
  const constantList = keyList.reduce((prev, curr) => {
    prev[curr] = settingList[curr]
    return prev
  }, {})
  for (const key of keyList) {
    if (!constantList[key]) {
      throw new Error(`[error] undefined setting constant: ${key}`)
    }
  }
  return constantList
}

