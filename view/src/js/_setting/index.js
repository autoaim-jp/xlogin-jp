/* /_setting/index.js */
import * as browserServerSetting from './browserServerSetting.js'

export const userHmacSecret = 'xlogin20220630'

export const bsc = browserServerSetting

const settingList = {
  userHmacSecret,
}

export const getBrowserServerSetting = () => {
  return browserServerSetting
}

export const get = (...keyList) => {
  const constantList = keyList.reduce((prev, curr) => {
    prev[curr] = settingList[curr]
    return prev
  }, {})
  for(const key of keyList) {
    if(!constantList[key]) {
      throw new Error('[error] undefined setting constant: ' + key)
    }
  }
  return constantList
}

