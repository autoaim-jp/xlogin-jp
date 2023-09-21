const TEST_PARAM_COMMON = {
  clientId: 'sample_localhost',
  owner: 'sample_localhost',
  accessToken: 'HREQxaXKQCvI4pMOJ4MA209-rQXbS0gr1sl4ENAdPLK5iAEHKWCrpHFy_jMJ8Qgt',
  jsonPath: '/profile/readme.txt',
  content: 'this is a test content!',
}

export const TEST_PARAM = {
  clientId: TEST_PARAM_COMMON.clientId,
  owner: TEST_PARAM_COMMON.owner,
  accessToken: TEST_PARAM_COMMON.accessToken,
  jsonPath: TEST_PARAM_COMMON.jsonPath,
  content: TEST_PARAM_COMMON.content,

}

export const EXPECTED_PARAM = {
  content: TEST_PARAM_COMMON.content,
}

