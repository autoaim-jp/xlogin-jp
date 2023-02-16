const breadcrumbAllList = {
  '/': 'ホーム',
  '/login': 'ログイン',
  '/confirm': '権限の確認',
  '/register': '新規登録',
  '/serviceList': 'サービス一覧',
  '/error': 'エラー',
}

const getBreadcrumbList = (pathList) => {
  return pathList.map((path) => { return { path, label: breadcrumbAllList[path] } })
}

export const ejsConfig = {
  _common: {
    componentPath: './view/src/ejs/component/',
    xdevkitComponentPath: './xdevkit/view/src/ejs/component/',
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
    title: 'register | xlogin.jp',
    description: 'register page',
    author: 'autoaim_jp',
    breadcrumbList: getBreadcrumbList(['/', '/error']),

    inlineCssList: [],
    externalCssList: ['/css/tailwind.css'],
    inlineScriptList: ['/js/error/app.js'],
    externalScriptList: [],
  },
}

