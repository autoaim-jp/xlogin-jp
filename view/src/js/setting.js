/* /setting.js */
export const apiEndpoint = '/f'
export const userHmacSecret = 'xlogin20220630'
export const labelList = {
  scope: {
    read: {
      'emailAddress': 'メールアドレスの取得',
      'userName': 'ユーザー名の取得',
      'serviceUserId': 'ユーザーIDの取得',
    },
    write: {
    },
    other: {
      isRequired: '必須',
    },
  },
  error: {
    handle_credential_credential: 'メールアドレスまたはパスワードが違います。',
    handle_user_add_register: 'メールアドレスは既に登録されています。',
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

