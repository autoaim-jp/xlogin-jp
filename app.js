import fs from 'fs'
import https from 'https'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import Redis from 'ioredis'
import RedisStore from 'connect-redis'
import dotenv from 'dotenv'
import path from 'path'

import statusList from './statusList.js'
import lib from './lib.js'
import core from './core.js'
import action from './action.js'
import scc from './serverCommonConstant.js'


const output = (req, res, handleResult) => {
  console.log('output error:', handleResult.error)
  req.session.auth = handleResult.session

  if (handleResult.response) {
    return res.json(handleResult.response)
  } else if (handleResult.redirect) {
    // if (req.method === 'GET') {
      return res.redirect(handleResult.redirect)
    /*
    } else {
      return res.json({ redirect: handleResult.redirect })
    }
    */
  } else {
    return res.redirect(true)
  }
}

const main = () => {
  dotenv.config()
  core.init(scc, lib)
  action.init(statusList, scc, lib)

  const expressApp = express()

  const redis = new Redis({
    port: scc.session.REDIS_PORT,
    host: scc.session.REDIS_HOST,
    db: scc.session.REDIS_DB,
  })
  expressApp.use(session({
    secret : process.env.SESSION_SECRET, 
    resave : true,
    saveUninitialized : true,                
    rolling : true,
    name : scc.session.SESSION_ID,
    cookie: {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: scc.session.SESSION_COOKIE_SECURE,
      httpOnly: true,
      sameSite: 'lax',
    },
    store: new (RedisStore(session))({ client: redis }),
  }))

  expressApp.use(bodyParser.urlencoded({ extended: true }))
  expressApp.use(bodyParser.json())
  expressApp.use(cookieParser())

  expressApp.get(`/api/${scc.url.API_VERSION}/auth/connect`, (req, res) => {
    const user = req.session.auth?.user
    const { clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod } = lib.paramSnakeToCamel(req.query)
    const resultHandleConnect = action.handleConnect(user, clientId, redirectUri, state, scope, responseType, codeChallenge, codeChallengeMethod, core.getErrorResponse, core.isValidClient)
    output(req, res, resultHandleConnect)
  })
  expressApp.post('/f/login/credential/check', async (req, res) => {
    const { emailAddress, passHmac2 } = lib.paramSnakeToCamel(req.body)
    const resultHandleCredentialCheck = await action.handleCredentialCheck(emailAddress, passHmac2, req.session.auth, core.credentialCheck, core.getErrorResponse, core.getUserByEmailAddress)
    output(req, res, resultHandleCredentialCheck)
  })
  expressApp.post('/f/confirm/permission/check', (req, res) => {
    const { permissionList } = lib.paramSnakeToCamel(req.body)
    const resultHandleConfirm = action.handleConfirm(permissionList, req.session.auth, core.getErrorResponse, core.registerAuthSession)
    output(req, res, resultHandleConfirm)
  })
  expressApp.get(`/api/${scc.url.API_VERSION}/auth/code`, (req, res) => {
    const { clientId, state, code, codeVerifier } = lib.paramSnakeToCamel(req.query)
    const resultHandleCode = action.handleCode(clientId, state, code, codeVerifier, core.registerAccessToken, core.getErrorResponse, core.getAuthSessionByCode)
    output(req, res, resultHandleCode)
  })
  expressApp.get(`/api/${scc.url.API_VERSION}/user/info`, (req, res) => {
    const accessToken = req.headers['authorization'].slice('Bearer '.length)
    const clientId = req.headers['x-xlogin-client-id']
    const { filterKeyListStr } = lib.paramSnakeToCamel(req.query)

    const resultHandleUserInfo = action.handleUserInfo(clientId, accessToken, filterKeyListStr, core.getUserByAccessToken, core.getErrorResponse)
    output(req, res, resultHandleUserInfo)
  })
  expressApp.post('/f/login/user/add', (req, res) => {
    const { emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked } = req.body
    const resultHandleUserAdd = action.handleUserAdd(emailAddress, passPbkdf2, saltHex, isTosChecked, isPrivacyPolicyChecked, req.session.auth, core.addUser, core.getErrorResponse, core.getUserByEmailAddress)
    output(req, res, resultHandleUserAdd)
  })
  expressApp.get('/f/confirm/scope/read', (req, res) => {
    const resultHandleScope = action.handleScope(req.session.auth, core.getErrorResponse)
    output(req, res, resultHandleScope)
  })
  expressApp.get('/logout', (req, res) => {
    const resultHandleLogout = action.handleLogout(req.session.auth)
    output(req, res, resultHandleLogout)
  })

  const appPath = `${path.dirname(new URL(import.meta.url).pathname)}/`
  expressApp.use(express.static(appPath + scc.server.PUBLIC_BUILD_DIR, { index: 'index.html', extensions: ['html'] }))
  expressApp.use(express.static(appPath + scc.server.PUBLIC_STATIC_DIR, { index: 'index.html', extensions: ['html'] }))

  expressApp.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)
    res.end('Internal Server Error')
  })

  if (process.env.SERVER_ORIGIN.indexOf('https') >= 0) {
    const tlsConfig = {
      key: fs.readFileSync(process.env.TLS_KEY_PATH),
      cert: fs.readFileSync(process.env.TLS_CERT_PATH),
    }
    const server = https.createServer(tlsConfig, expressApp)
    server.listen(process.env.SERVER_PORT, () => {
      console.log(`Example app listening at port: ${process.env.SERVER_PORT}, origin: ${process.env.SERVER_ORIGIN}`)
    })
  } else {
    expressApp.listen(process.env.SERVER_PORT, () => {
      console.log(`Example app listening at port: ${process.env.SERVER_PORT}, origin: ${process.env.SERVER_ORIGIN}`)
    })
  }

  console.log(`open: http://${process.env.SERVER_ORIGIN}/`)
}

main()

