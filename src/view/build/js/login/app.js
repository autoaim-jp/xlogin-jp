(() => {
  var __defProp = Object.defineProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // view/src/js/_setting/index.js
  var setting_exports = {};
  __export(setting_exports, {
    bsc: () => bsc,
    get: () => get2,
    getBrowserServerSetting: () => getBrowserServerSetting,
    scopeExtraConfigList: () => scopeExtraConfigList,
    userHmacSecret: () => userHmacSecret
  });

  // view/src/js/_setting/browserServerSetting.js
  var browserServerSetting_exports = {};
  __export(browserServerSetting_exports, {
    apiEndpoint: () => apiEndpoint,
    default: () => browserServerSetting_default,
    get: () => get,
    labelList: () => labelList,
    statusList: () => statusList,
    userReadableDateFormat: () => userReadableDateFormat
  });
  var apiEndpoint = "/f";
  var labelList = {
    scopeBody: {
      global: {
        notification: {
          label: "\u3059\u3079\u3066\u306E\u901A\u77E5",
          summary: "\u3059\u3079\u3066\u306E\u30B5\u30FC\u30D3\u30B9\u306E\u901A\u77E5\u306B\u95A2\u3059\u308B\u6A29\u9650\u3067\u3059\u3002\u30ED\u30B0\u30A4\u30F3\u6642\u523B\u306A\u3069\u3092\u542B\u307F\u307E\u3059\u3002"
        }
      },
      auth: {
        emailAddress: {
          label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
          summary: "\u30ED\u30B0\u30A4\u30F3\u306B\u4F7F\u7528\u3059\u308B\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306B\u95A2\u3059\u308B\u6A29\u9650\u3067\u3059\u3002\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u542B\u307F\u307E\u305B\u3093\u3002"
        },
        backupEmailAddress: {
          label: "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
          summary: "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306B\u95A2\u3059\u308B\u6A29\u9650\u3067\u3059\u3002\u30ED\u30B0\u30A4\u30F3\u306B\u4F7F\u7528\u3059\u308B\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u542B\u307F\u307E\u305B\u3093\u3002"
        },
        userName: {
          label: "\u30E6\u30FC\u30B6\u30FC\u540D",
          summary: "\u4E00\u822C\u516C\u958B\u3055\u308C\u3066\u3044\u308B\u30E6\u30FC\u30B6\u30FC\u306E\u540D\u524D\u3067\u3059\u3002"
        }
      },
      service: {
        serviceUserId: {
          label: "\u30E6\u30FC\u30B6\u30FCID",
          summary: "\u9023\u643A\u3059\u308B\u30B5\u30FC\u30D3\u30B9\u306B\u63D0\u4F9B\u3059\u308B\u3001\u3042\u306A\u305F\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u306EID\u3067\u3059\u3002\u30B5\u30FC\u30D3\u30B9\u6BCE\u306B\u7570\u306A\u308A\u307E\u3059\u3002"
        },
        notification: {
          label: "\u30B5\u30FC\u30D3\u30B9\u5185\u901A\u77E5",
          summary: "\u9023\u643A\u3059\u308B\u30B5\u30FC\u30D3\u30B9\u5185\u3067\u3001\u901A\u77E5\u6A5F\u80FD\u3092\u5229\u7528\u3059\u308B\u305F\u3081\u306E\u6A29\u9650\u3067\u3059\u3002"
        },
        file: {
          label: "\u30D5\u30A1\u30A4\u30EB",
          summary: "\u9023\u643A\u3059\u308B\u30B5\u30FC\u30D3\u30B9\u3067\u3001\u3042\u306A\u305F\u304C\u30C7\u30FC\u30BF\u3092\u4FDD\u5B58\u3067\u304D\u307E\u3059\u3002"
        }
      }
    },
    scopeOperation: {
      operation: {
        read: "\u53D6\u5F97",
        write: "\u4FDD\u5B58",
        append: "\u8FFD\u8A18"
      },
      prefix: {
        isRequired: "\u5FC5\u9808"
      }
    },
    error: {
      undefined: "error",
      handle_credential_credential: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u307E\u305F\u306F\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u9055\u3044\u307E\u3059\u3002",
      handle_user_add_register: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u65E2\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059\u3002",
      handle_xlogin_code_session: "\u30BB\u30C3\u30B7\u30E7\u30F3\u304C\u4E0D\u6B63\u3067\u3059\u3002"
    }
  };
  var statusList = {
    OK: 1,
    SUCCESS: 100,
    LOGIN_SUCCESS: 101,
    INVALID: 1e3,
    NOT_ENOUGH_PARAM: 1001,
    INVALID_SESSION: 1002,
    API_ERROR: 1100,
    INVALID_OIDC_ISSUER: 1101,
    NOT_FOUND: 1200
  };
  var userReadableDateFormat = {
    full: "YYYY/MM/DD hh:mm:ss",
    day: "YYYY/MM/DD",
    hourMinute: "hh:mm",
    time: "hh:mm:ss"
  };
  var settingList = {
    apiEndpoint,
    labelList,
    statusList,
    userReadableDateFormat
  };
  var get = (...keyList) => {
    const constantList = keyList.reduce((prev, curr) => {
      prev[curr] = settingList[curr];
      return prev;
    }, {});
    for (const key of keyList) {
      if (!constantList[key]) {
        throw new Error(`[error] undefined setting constant: ${key}`);
      }
    }
    return constantList;
  };
  var browserServerSetting_default = settingList;

  // view/src/js/_setting/index.js
  var userHmacSecret = "xlogin20220630";
  var scopeExtraConfigList = {
    "auth:backupEmailAddress": {
      templateId: "#permissionCheckBlackTemplate",
      dialogConfirm: true
    }
  };
  var bsc = browserServerSetting_exports;
  var settingList2 = {
    userHmacSecret,
    scopeExtraConfigList
  };
  var getBrowserServerSetting = () => {
    return browserServerSetting_exports;
  };
  var get2 = (...keyList) => {
    const constantList = keyList.reduce((prev, curr) => {
      prev[curr] = settingList2[curr];
      return prev;
    }, {});
    for (const key of keyList) {
      if (!constantList[key]) {
        throw new Error(`[error] undefined setting constant: ${key}`);
      }
    }
    return constantList;
  };

  // view/src/js/lib.js
  var lib_exports = {};
  __export(lib_exports, {
    buf2Hex: () => buf2Hex,
    calcHmac512: () => calcHmac512,
    calcPbkdf2: () => calcPbkdf2,
    genSalt: () => genSalt,
    getCaller: () => getCaller,
    getErrorModalElmAndSetter: () => getErrorModalElmAndSetter,
    getModalElmAndSetter: () => getModalElmAndSetter,
    getRandomStr: () => getRandomStr,
    getRequest: () => getRequest,
    getSearchQuery: () => getSearchQuery,
    monkeyPatch: () => monkeyPatch,
    postRequest: () => postRequest,
    redirect: () => redirect,
    setOnClickNavManu: () => setOnClickNavManu,
    setOnClickNotification: () => setOnClickNotification,
    showGlobalNotification: () => showGlobalNotification,
    showModal: () => showModal,
    slideDown: () => slideDown,
    slideToggle: () => slideToggle,
    slideUp: () => slideUp,
    switchLoading: () => switchLoading
  });
  var getCaller = () => {
    const callerInfo = new Error().stack.replace(/^Error\n.*\n.*\n/, "");
    return callerInfo;
  };
  var getRequest = (_url, param = {}) => {
    const query = param && Object.keys(param).map((key) => {
      return `${key}=${param[key]}`;
    }).join("&");
    const url = query ? `${_url}?${query}` : _url;
    const opt = {
      method: "GET",
      credentials: "same-origin",
      timeout: 30 * 1e3
    };
    return fetch(url, opt).then((res) => {
      if (res.error || !res.body || !res.json) {
        return null;
      }
      return res.json();
    }).catch((e) => {
      console.error("[fatal] error @getRequest:", e);
      return null;
    });
  };
  var postRequest = (url, param = {}) => {
    const opt = {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 30 * 1e3
    };
    if (param) {
      opt.body = JSON.stringify(param);
    }
    return fetch(url, opt).then((res) => {
      if (res.error || !res.body || !res.json) {
        return null;
      }
      return res.json();
    }).catch((e) => {
      console.error("[fatal] error @postRequest:", e);
      return null;
    });
  };
  var applyElmList = (query, f, parent = document) => {
    Object.values(parent.querySelectorAll(query)).forEach((elm) => {
      f(elm);
    });
  };
  var closeModal = () => {
    applyElmList('[data-id="modal"], #modalBackground', (elm) => {
      elm.classList.add("hidden");
    });
  };
  var showModal = (modalElm, cancelButtonIsVisible = false) => {
    return new Promise((resolve) => {
      if (modalElm.id === "modalTemplate") {
        modalElm.id = "";
      }
      document.body.appendChild(modalElm);
      closeModal();
      setTimeout(() => {
        applyElmList('[data-id="modalClose"], [data-id="modalCancelButton"]', (elm) => {
          elm.onclick = () => {
            closeModal();
            return resolve(false);
          };
        }, document);
        if (cancelButtonIsVisible) {
          modalElm.querySelector('[data-id="modalCancelButton"]').classList.remove("hidden");
        } else {
          modalElm.querySelector('[data-id="modalCancelButton"]').classList.add("hidden");
        }
        modalElm.querySelector('[data-id="modalConfirmButton"]').onclick = () => {
          closeModal();
          return resolve(true);
        };
        modalElm.classList.remove("hidden");
        document.querySelector("#modalBackground").classList.remove("hidden");
        modalElm.querySelector('[data-id="modalContent"]').scrollTop = 0;
        modalElm.querySelector('[data-id="modalCard"]').onclick = (e) => {
          e.stopPropagation();
        };
        modalElm.onclick = (e) => {
          e.stopPropagation();
          closeModal();
          return resolve(false);
        };
      }, 100);
    });
  };
  var getErrorModalElmAndSetter = () => {
    const modalTemplateElm = document.querySelector("#modalTemplate");
    const modalElm = modalTemplateElm.cloneNode(true);
    const modalTitleElm = modalElm.querySelector('[data-id="modalTitle"]');
    modalTitleElm.innerText = "\u30A8\u30E9\u30FC";
    const labelP = document.createElement("p");
    labelP.innerText = "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002";
    modalElm.querySelector('[data-id="modalContent"]').appendChild(labelP);
    const setContent = (textStr, errorLabelList = null, title = "\u30A8\u30E9\u30FC") => {
      if (errorLabelList) {
        labelP.innerText = errorLabelList[textStr] || textStr;
      } else {
        labelP.innerText = textStr;
      }
      modalTitleElm.innerText = title;
    };
    return { modalElm, setContent };
  };
  var getModalElmAndSetter = () => {
    const modalTemplateElm = document.querySelector("#modalTemplate");
    const modalElm = modalTemplateElm.cloneNode(true);
    const modalTitleElm = modalElm.querySelector('[data-id="modalTitle"]');
    const modalContentElm = modalElm.querySelector('[data-id="modalContent"]');
    const setContentElm = (title, contentElm) => {
      modalTitleElm.innerText = title;
      modalContentElm.clearChildren();
      modalContentElm.appendChild(contentElm);
    };
    return { modalElm, setContentElm };
  };
  var switchLoading = (isVisible) => {
    const loadingElm = document.querySelector("#loading");
    if (!loadingElm) {
      return;
    }
    if (isVisible) {
      loadingElm.classList.remove("hidden");
    } else {
      loadingElm.classList.add("hidden");
    }
  };
  var setOnClickNavManu = () => {
    const toggleElm = document.querySelector("#commonNavToggle");
    const navContentElm = document.querySelector("#commonNavContent");
    toggleElm.onclick = () => {
      if ([...navContentElm.classList.values()].indexOf("hidden") >= 0) {
        navContentElm.classList.remove("hidden");
      } else {
        navContentElm.classList.add("hidden");
      }
    };
  };
  var notificationIsVisible = false;
  var showGlobalNotification = async (apiEndpoint2) => {
    const durationShow = 0.5;
    const durationHide = 0.2;
    const resultFetchGlobalNotification = await getRequest(`${apiEndpoint2}/notification/global/list`);
    const notificationContainerElm = document.querySelector("#notificationContainer");
    notificationContainerElm.clearChildren();
    const notificationTemplateElm = document.querySelector("#notificationTemplate");
    const notificationList = Object.values(resultFetchGlobalNotification?.result?.globalNotificationList || {}).reverse();
    notificationList.forEach((row, i) => {
      const notificationElm = notificationTemplateElm.cloneNode(true);
      notificationElm.classList.remove("hidden");
      notificationElm.querySelector('[data-id="subject"]').innerText = row.subject;
      notificationElm.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const modalTemplateElm = document.querySelector("#modalTemplate");
        const modalElm = modalTemplateElm.cloneNode(true);
        modalElm.classList.remove("hidden");
        modalElm.querySelector('[data-id="modalTitle"]').innerText = row.subject;
        modalElm.querySelector('[data-id="modalContent"]').appendChild(document.createTextNode(row.detail));
        showModal(modalElm);
      };
      setTimeout(() => {
        notificationElm.style.transitionDuration = `${durationShow}s`;
        notificationElm.style.opacity = 0;
        notificationContainerElm.appendChild(notificationElm);
        setTimeout(() => {
          notificationElm.style.opacity = 1;
        }, 100);
      }, durationShow * i * 1e3);
      setTimeout(() => {
        notificationElm.style.transitionDuration = `${durationHide}s`;
        notificationElm.style.opacity = 0;
      }, durationShow * notificationList.length * 1e3 + 3 * 1e3 + durationHide * i * 1e3);
    });
    setTimeout(() => {
      notificationContainerElm.clearChildren();
      notificationIsVisible = false;
    }, (durationShow + durationHide) * notificationList.length * 1e3 + 3 * 1e3);
  };
  var setOnClickNotification = (apiEndpoint2) => {
    applyElmList('[data-id="notificationBtn"]', (notificationBtn) => {
      notificationBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (notificationIsVisible) {
          return;
        }
        notificationIsVisible = true;
        showGlobalNotification(apiEndpoint2);
      };
    });
  };
  var monkeyPatch = () => {
    if (typeof Element.prototype.clearChildren === "undefined") {
      Object.defineProperty(Element.prototype, "clearChildren", {
        configurable: true,
        enumerable: false,
        value() {
          while (this.firstChild) {
            this.removeChild(this.lastChild);
          }
        }
      });
    }
    if (typeof window.argNamed === "undefined") {
      window.argNamed = (obj) => {
        const flattened = {};
        Object.keys(obj).forEach((key) => {
          if (Array.isArray(obj[key])) {
            Object.assign(flattened, obj[key].reduce((prev, curr) => {
              if (typeof curr === "undefined") {
                throw new Error(`[error] flat argument by list can only contain function but: ${typeof curr} @${key}
===== maybe you need make func exported like  module.exports = { func, } =====`);
              } else if (typeof curr === "function") {
                prev[curr.name] = curr;
              } else {
                throw new Error(`[error] flat argument by list can only contain function but: ${typeof curr} @${key}`);
              }
              return prev;
            }, {}));
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            Object.assign(flattened, obj[key]);
          } else {
            flattened[key] = obj[key];
          }
        });
        return flattened;
      };
    }
  };
  var getRandomStr = (len) => {
    return btoa(crypto.getRandomValues(new Uint8Array(len))).slice(0, len);
  };
  var buf2Hex = (buf) => {
    return Array.prototype.map.call(new Uint8Array(buf), (x) => {
      return `00${x.toString(16)}`.slice(-2);
    }).join("");
  };
  var calcHmac512 = (data, secret) => {
    return new Promise((resolve) => {
      const enc = new TextEncoder("utf-8");
      window.crypto.subtle.importKey("raw", enc.encode(secret), {
        name: "HMAC",
        hash: { name: "SHA-512" }
      }, false, ["sign", "verify"]).then((key) => {
        window.crypto.subtle.sign("HMAC", key, enc.encode(data)).then((hash) => {
          const buf = new Uint8Array(hash);
          resolve(buf2Hex(buf));
        });
      });
    });
  };
  var genSalt = () => {
    return window.crypto.getRandomValues(new Uint8Array(64));
  };
  var calcPbkdf2 = (str, salt) => {
    return new Promise((resolve) => {
      const byteList = new Uint8Array(Array.prototype.map.call(str, (c) => {
        return c.charCodeAt(0);
      }));
      window.crypto.subtle.importKey("raw", byteList, { name: "PBKDF2" }, false, ["deriveBits"]).then((key) => {
        const opt = {
          name: "PBKDF2",
          salt,
          iterations: 1e3 * 1e3,
          hash: { name: "SHA-512" }
        };
        return window.crypto.subtle.deriveBits(opt, key, 512).then((buf) => {
          resolve(buf2Hex(buf));
        });
      });
    });
  };
  var redirect = (response) => {
    if (response && response.redirect) {
      window.location.href = response.redirect;
    }
  };
  var getSearchQuery = () => {
    const searchQuery = {};
    window.location.search.replace(/^\?/, "").split("&").forEach((row) => {
      const kv = row.split("=");
      const [key, value] = kv;
      searchQuery[key] = value;
    });
    return searchQuery;
  };
  var slideUp = (elm, duration = 300) => {
    elm.style.height = `${elm.offsetHeight}px`;
    if (elm.offsetHeight === null) {
      return;
    }
    elm.style.transitionProperty = "height, margin, padding";
    elm.style.transitionDuration = `${duration}ms`;
    elm.style.transitionTimingFunction = "ease";
    elm.style.overflow = "hidden";
    elm.style.height = 0;
    elm.style.paddingTop = 0;
    elm.style.paddingBottom = 0;
    elm.style.marginTop = 0;
    elm.style.marginBottom = 0;
    setTimeout(() => {
      elm.style.display = "none";
      elm.style.removeProperty("height");
      elm.style.removeProperty("padding-top");
      elm.style.removeProperty("padding-bottom");
      elm.style.removeProperty("margin-top");
      elm.style.removeProperty("margin-bottom");
      elm.style.removeProperty("overflow");
      elm.style.removeProperty("transition-duration");
      elm.style.removeProperty("transition-property");
      elm.style.removeProperty("transition-timing-function");
    }, duration);
  };
  var slideDown = (elm, duration = 300) => {
    elm.style.removeProperty("display");
    let { display } = window.getComputedStyle(elm);
    if (display === "none") {
      display = "block";
    }
    elm.style.display = display;
    const height = elm.offsetHeight;
    elm.style.overflow = "hidden";
    elm.style.height = 0;
    elm.style.paddingTop = 0;
    elm.style.paddingBottom = 0;
    elm.style.marginTop = 0;
    elm.style.marginBottom = 0;
    if (elm.offsetHeight === null) {
      return;
    }
    elm.style.transitionProperty = "height, margin, padding";
    elm.style.transitionDuration = `${duration}ms`;
    elm.style.transitionTimingFunction = "ease";
    elm.style.height = `${height}px`;
    elm.style.removeProperty("padding-top");
    elm.style.removeProperty("padding-bottom");
    elm.style.removeProperty("margin-top");
    elm.style.removeProperty("margin-bottom");
    setTimeout(() => {
      elm.style.removeProperty("height");
      elm.style.removeProperty("overflow");
      elm.style.removeProperty("transition-duration");
      elm.style.removeProperty("transition-property");
      elm.style.removeProperty("transition-timing-function");
    }, duration);
  };
  var slideToggle = (elm, duration = 300, ignoreIfOpen = false) => {
    if (window.getComputedStyle(elm).display === "none") {
      slideDown(elm, duration);
    } else if (!ignoreIfOpen) {
      slideUp(elm, duration);
    }
  };

  // view/src/js/login/action.js
  var action_exports = {};
  __export(action_exports, {
    default: () => action_default,
    getOnSubmitLogin: () => getOnSubmitLogin
  });
  var getOnSubmitLogin = ({
    calcHmac512: calcHmac5122,
    userHmacSecret: userHmacSecret2,
    labelList: labelList2,
    emailAddressInputElm,
    passInputElm,
    postLogin,
    redirect: redirect2,
    switchLoading: switchLoading2,
    showModal: showModal2,
    getErrorModalElmAndSetter: getErrorModalElmAndSetter2
  }) => {
    const { modalElm, setContent } = getErrorModalElmAndSetter2();
    return async () => {
      switchLoading2(true);
      const emailAddress = emailAddressInputElm.value;
      const pass = passInputElm.value;
      const passHmac1 = await calcHmac5122(pass, userHmacSecret2);
      const passHmac2 = await calcHmac5122(passHmac1, userHmacSecret2);
      postLogin({ emailAddress, passHmac2 }).then((result) => {
        switchLoading2(false);
        if (result.error) {
          setContent(result.error, labelList2.error);
          showModal2(modalElm, false);
        } else {
          redirect2(result);
        }
      });
      return false;
    };
  };
  var action_default = {};

  // view/src/js/login/output.js
  var output_exports = {};
  __export(output_exports, {
    getLoginFormElm: () => getLoginFormElm,
    getPostLogin: () => getPostLogin,
    setLoginFormSubmit: () => setLoginFormSubmit
  });
  var getPostLogin = ({ apiEndpoint: apiEndpoint2, postRequest: postRequest2 }) => {
    const url = `${apiEndpoint2}/login/credential/check`;
    return ({ emailAddress, passHmac2 }) => {
      const param = { emailAddress, passHmac2 };
      return postRequest2(url, param);
    };
  };
  var getLoginFormElm = () => {
    const emailAddressInputElm = document.querySelector("#emailAddressInput");
    const passInputElm = document.querySelector("#passInput");
    return { emailAddressInputElm, passInputElm };
  };
  var setLoginFormSubmit = ({ onSubmitLogin }) => {
    const loginFormElm = document.querySelector("#loginForm");
    loginFormElm.onsubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmitLogin();
    };
  };

  // view/src/js/login/app.js
  var asocial = {};
  asocial.setting = setting_exports;
  asocial.lib = lib_exports;
  asocial.action = action_exports;
  asocial.output = output_exports;
  var a = asocial;
  var loadLoginForm = () => {
    const postLogin = a.output.getPostLogin(argNamed({
      browserServerSetting: a.setting.bsc.get("apiEndpoint"),
      lib: [a.lib.postRequest]
    }));
    const { emailAddressInputElm, passInputElm } = a.output.getLoginFormElm();
    const onSubmitLogin = a.action.getOnSubmitLogin(argNamed({
      browserServerSetting: a.setting.bsc.get("labelList"),
      setting: a.setting.get("userHmacSecret"),
      lib: [a.lib.calcHmac512, a.lib.switchLoading, a.lib.redirect, a.lib.showModal, a.lib.getErrorModalElmAndSetter],
      other: { emailAddressInputElm, passInputElm, postLogin }
    }));
    a.output.setLoginFormSubmit(argNamed({
      onSubmit: { onSubmitLogin }
    }));
  };
  var main = async () => {
    a.lib.switchLoading(true);
    a.lib.setOnClickNavManu();
    a.lib.setOnClickNotification(a.setting.bsc.apiEndpoint);
    a.lib.monkeyPatch();
    a.app.loadLoginForm();
    setTimeout(() => {
      a.lib.switchLoading(false);
    }, 300);
  };
  a.app = {
    main,
    loadLoginForm
  };
  a.app.main();
})();
