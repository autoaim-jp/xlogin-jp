/* /setting.js */
export const apiEndpoint = '/f'
export const userHmacSecret = 'xlogin20220630'
export const labelList = {
  scope: {
    read: {
      'email_address': 'メールアドレスの取得',
      'user_name': 'ユーザー名の取得',
      'service_user_id': 'ユーザーIDの取得',
    },
    write: {
    },
    other: {
      isRequired: '必須',
    },
  },
}

const settingList = {
  apiEndpoint,
  userHmacSecret,
  labelList,
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

