const statusList = {}
statusList.OK = 1
statusList.SUCCESS = 100
statusList.LOGIN_SUCCESS = 101

statusList.INVALID = 1000
statusList.INVALID_CREDENTIAL = 1001
statusList.INVALID_SESSION = 1002
statusList.INVALID_CHECK = 1003

statusList.API_ERROR = 1100
statusList.INVALID_OIDC_ISSUER = 1101

statusList.PARAM_ERROR = 1200
statusList.NOT_ENOUGH_PARAM = 1201

statusList.USER_FAIL = 1300
statusList.REGISTER_FAIL = 1301

statusList.CLIENT_FAIL = 1400

statusList.INVALID_XLOGIN = 2000
statusList.INVALID_CLIENT = 2001
statusList.INVALID_CODE_VERIFIER = 2002

statusList.SERVER_ERROR = 3000

export default statusList

