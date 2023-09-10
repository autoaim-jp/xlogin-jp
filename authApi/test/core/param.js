const TEST_PARAM_COMMON = {
  emailAddress: 'user@example.com',
  userName: 'test user',
  clientId: 'sample_localhost',
  redirectUri: 'http://127.0.0.1:3001/f/xlogin/callback',
  state: 'VeCTGA3M3O1KEWl4xtEKTuPKH8FrGmDlpowa0ZQ86scPneoqlgZVaTg5ZFGu3eO6',
  scope: 'r:auth:emailAddress,rw:auth:backupEmailAddress,*r:auth:userName,*r:sample_localhost:serviceUserId,*rw:sample_localhost:notification,rw:sample_localhost:file',
  responseType: 'code',
  codeChallenge: 'O-7bvwRh5ZevD4MyZ-bcee3NbxH8ddyNvNLl4t-kaLE',
  codeChallengeMethod: 'S256',
  requestScope: '',
  passHmac2: 'de9c2c84cc67f30892d2f6f3f8b8c11f11ffcb2cf4d6a9b669a46147c0db437656b7c42a8098c99fb4ad7ced651b64be0aee78eab62e625be1b8fbac894521cc',

  codeVerifier: 'ZxdT4pXVo1hNuk6CtcK7NAu_dBjsiiVUDOo01Ap_-A8HUcmnRKg4mG4R19pdshGy',

  splitPermissionList: {
    optional: {
      'r:auth:emailAddress': false,
      'rw:auth:backupEmailAddress': false,
      'rw:sample_localhost:file': false,
    },
    required: {
      'r:auth:userName': true,
      'r:sample_localhost:serviceUserId': true,
      'rw:sample_localhost:notification': true,
    },
  },
  filterKeyListStr: 'auth:emailAddress,auth:backupEmailAddress,auth:userName,sample_localhost:serviceUserId,sample_localhost:notification,sample_localhost:file',

  _dummyCode: '$$_CODE_$$',
}

export const TEST_PARAM = {
  // handleConnect
  user: { emailAddress: TEST_PARAM_COMMON.emailAddress, userName: TEST_PARAM_COMMON.userName, },
  clientId: TEST_PARAM_COMMON.clientId,
  redirectUri: TEST_PARAM_COMMON.redirectUri,
  state: TEST_PARAM_COMMON.state,
  scope: TEST_PARAM_COMMON.scope,
  responseType: TEST_PARAM_COMMON.responseType,
  codeChallenge: TEST_PARAM_COMMON.codeChallenge,
  codeChallengeMethod: TEST_PARAM_COMMON.codeChallengeMethod,
  requestScope: TEST_PARAM_COMMON.requestScope,

  // handleCredentialCheck
  emailAddress: TEST_PARAM_COMMON.emailAddress,
  passHmac2: TEST_PARAM_COMMON.passHmac2,

  // handleCredentialCheck, handleConfirm, handleThrough
  authSession: {
    oidc: {
      clientId: TEST_PARAM_COMMON.clientId,
      state: TEST_PARAM_COMMON.state,
      scope: TEST_PARAM_COMMON.scope,
      responseType: TEST_PARAM_COMMON.responseType,
      codeChallenge: TEST_PARAM_COMMON.codeChallenge,
      codeChallengeMethod: TEST_PARAM_COMMON.codeChallengeMethod,
      redirectUri: TEST_PARAM_COMMON.redirectUri,
      requestScope: TEST_PARAM_COMMON.requestScope,
      condition: null
    }
  },

  // handleConfirm, handleThrough
  ipAddress: '192.168.1.XYZ',
  useragent: { browser: 'Godzilla', platform: 'xlogin' },

  // handleConfirm
  permissionList: {
    'r:sample_localhost:serviceUserId': true,
    'rw:sample_localhost:notification': true,
    'r:auth:userName': true,
    'rw:auth:backupEmailAddress': false,
    'rw:sample_localhost:file': false,
    'r:auth:emailAddress': false
  },

  // handleCode
  codeVerifier: TEST_PARAM_COMMON.codeVerifier,

  // handleUserInfo
  filterKeyListStr: TEST_PARAM_COMMON.filterKeyListStr,

}

export const EXPECTED_PARAM = {
  // handleConnect, handleCredentialCheck, handleThrough
  session: {
    oidc: {
      clientId: TEST_PARAM.clientId,
      state: TEST_PARAM.state,
      scope: TEST_PARAM.scope,
      responseType: TEST_PARAM.responseType,
      codeChallenge: TEST_PARAM.codeChallenge,
      codeChallengeMethod: TEST_PARAM.codeChallengeMethod,
      redirectUri: TEST_PARAM.redirectUri,
      requestScope: TEST_PARAM.requestScope,
      condition: undefined,
    },
    user: TEST_PARAM.user
  },

  // handleCode, handleThroughReturnRedirect
  splitPermissionList: TEST_PARAM_COMMON.splitPermissionList,

  // handleThroughReturnRedirect
  requestScope: TEST_PARAM_COMMON.requestScope,
  state: TEST_PARAM_COMMON.state,
  _dummyCode: TEST_PARAM_COMMON._dummyCode,

  // handleUserInfo
  clientId: TEST_PARAM_COMMON.clientId,
  userName: TEST_PARAM_COMMON.userName,
}

