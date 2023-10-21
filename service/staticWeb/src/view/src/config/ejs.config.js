import path from 'path'
import { fileURLToPath } from 'url'

const breadcrumbAllList = {
  '/': 'ホーム',
  '/login': 'ログイン',
  '/confirm': '権限の確認',
  '/register': '新規登録',
  '/serviceList': 'サービス一覧',
  '/error': 'エラー',
}

const getBreadcrumbList = (pathList) => {
  return pathList.map((_path) => { return { path: _path, label: breadcrumbAllList[_path] } })
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ejsConfig = {
  _common: {
    componentPath: `${__dirname}/../ejs/component/`,
    xdevkitComponentPath: `${__dirname}/../ejs/_xdevkit/component/`,
  },

  index: {
    title: 'xlogin.jp',
    description: 'simple login service',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: ['/js/index/app.js'],
    externalScriptList: [],
  },

  login: {
    title: 'login | xlogin.jp',
    description: 'login page',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/', '/login']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: ['/js/login/app.js'],
    externalScriptList: [],
  },

  confirm: {
    title: 'confirm | xlogin.jp',
    description: 'confirm permission',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/', '/confirm']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: ['/js/confirm/app.js'],
    externalScriptList: [],

  },

  register: {
    title: 'register | xlogin.jp',
    description: 'register page',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/', '/register']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: ['/js/register/app.js'],
    externalScriptList: [],
  },

  serviceList: {
    title: 'service list | xlogin.jp',
    description: 'service list page',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/', '/serviceList']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: ['/js/serviceList/app.js'],
    externalScriptList: [],
  },

  error: {
    title: 'error | xlogin.jp',
    description: 'error page',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/', '/error']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: ['/js/error/app.js'],
    externalScriptList: [],
  },

  tos: {
    title: 'tos | xlogin.jp',
    description: 'tos page',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/', '/tos']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: [],
    externalScriptList: [],
  },

  privacyPolicy: {
    title: 'privacy policy | xlogin.jp',
    description: 'privacy policy page',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/', '/privacyPolicy']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: [],
    externalScriptList: [],
  },

}

export default {
  ejsConfig,
}
