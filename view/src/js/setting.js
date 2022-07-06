/* /setting.js */
export const apiEndpoint = '/f'
export const userHmacSecret = 'xlogin20220630'

const settingList = {
  apiEndpoint,
  userHmacSecret,
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

