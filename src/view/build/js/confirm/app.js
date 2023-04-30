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

  // view/src/js/confirm/input.js
  var input_exports = {};
  __export(input_exports, {
    default: () => input_default,
    fetchScope: () => fetchScope
  });
  var fetchScope = ({ getRequest: getRequest2, apiEndpoint: apiEndpoint2 }) => {
    const url = `${apiEndpoint2}/confirm/scope/list`;
    return getRequest2(url);
  };
  var input_default = {};

  // view/src/js/confirm/action.js
  var action_exports = {};
  __export(action_exports, {
    default: () => action_default,
    getOnClickCheckAllScopeButton: () => getOnClickCheckAllScopeButton,
    getOnClickScopeDetailBtn: () => getOnClickScopeDetailBtn,
    getOnClickShowOptionPermissionBtn: () => getOnClickShowOptionPermissionBtn,
    getOnSubmitConfirm: () => getOnSubmitConfirm
  });
  var getOnSubmitConfirm = ({
    getPermissionCheckList: getPermissionCheckList2,
    postConfirm,
    switchLoading: switchLoading2,
    redirect: redirect2,
    checkImportantPermissionWithModal: checkImportantPermissionWithModal2,
    scopeExtraConfigList: scopeExtraConfigList2,
    labelList: labelList2,
    showModal: showModal2,
    getErrorModalElmAndSetter: getErrorModalElmAndSetter2,
    resultCheckTrough
  }) => {
    return async () => {
      switchLoading2(true);
      const permissionList = getPermissionCheckList2();
      const isAuthorized = await checkImportantPermissionWithModal2({
        permissionList,
        resultCheckTrough,
        scopeExtraConfigList: scopeExtraConfigList2,
        labelList: labelList2,
        showModal: showModal2,
        getErrorModalElmAndSetter: getErrorModalElmAndSetter2
      });
      if (!isAuthorized) {
        switchLoading2(false);
        return;
      }
      postConfirm({ permissionList }).then((result) => {
        switchLoading2(false);
        redirect2(result);
      });
    };
  };
  var getOnClickCheckAllScopeButton = ({
    getRequiredPermissionCheckElmList: getRequiredPermissionCheckElmList2
  }) => {
    return () => {
      setTimeout(() => {
        const permissionCheckElmList = getRequiredPermissionCheckElmList2();
        permissionCheckElmList.forEach((elm) => {
          elm.checked = true;
        });
      }, 300);
    };
  };
  var getOnClickShowOptionPermissionBtn = ({
    notRequiredPermissionListElm,
    flipSvgElm,
    slideToggle: slideToggle2
  }) => {
    return () => {
      slideToggle2(notRequiredPermissionListElm, 300, false);
      if (flipSvgElm.classList.contains("flipY")) {
        flipSvgElm.classList.remove("flipY");
      } else {
        flipSvgElm.classList.add("flipY");
      }
    };
  };
  var getOnClickScopeDetailBtn = ({
    getModalElmAndSetter: getModalElmAndSetter2,
    showModal: showModal2
  }) => {
    const { modalElm, setContentElm } = getModalElmAndSetter2();
    return (modalTitle, contentElm) => {
      setContentElm(modalTitle, contentElm);
      showModal2(modalElm);
    };
  };
  var action_default = {};

  // view/src/js/confirm/core.js
  var core_exports = {};
  __export(core_exports, {
    checkImportantPermissionWithModal: () => checkImportantPermissionWithModal,
    checkThrough: () => checkThrough,
    convertPermissionList: () => convertPermissionList
  });
  var _convertScopeToLabel = ({ labelList: labelList2, scope }) => {
    const paramList = scope.split(":");
    if (paramList.length < 2) {
      throw new Error(`invalid scope value: ${scope}`);
    }
    let isRequired = null;
    const modeList = [];
    if (paramList[0][0] === "*") {
      isRequired = true;
      paramList[0] = paramList[0].slice(1);
    } else {
      isRequired = false;
    }
    if (paramList[0].indexOf("r") >= 0) {
      modeList.push("read");
    }
    if (paramList[0].indexOf("w") >= 0) {
      modeList.push("write");
    }
    if (paramList[0].indexOf("a") >= 0) {
      modeList.push("append");
    }
    if (modeList.length === 0) {
      throw new Error(`unknown mode: ${paramList[0]}`);
    }
    if (paramList[1] !== "auth") {
      paramList[1] = "service";
    }
    const operation = modeList.map((mode) => {
      return labelList2.scopeOperation.operation[mode];
    }).join("\u3068");
    const { label: labelPart, summary } = labelList2.scopeBody[paramList[1]][paramList[2]];
    const labelNoWrapList = [];
    labelNoWrapList.push(labelPart);
    if (isRequired) {
      labelNoWrapList.push(`\u306E${operation} (${labelList2.scopeOperation.prefix.isRequired})`);
    } else {
      labelNoWrapList.push(`\u306E${operation}`);
    }
    const label = labelNoWrapList.join("");
    return {
      labelNoWrapList,
      label,
      summary,
      isRequired
    };
  };
  var convertPermissionList = ({ labelList: labelList2, resultFetchScope }) => {
    if (!resultFetchScope || !resultFetchScope.result || !resultFetchScope.result.scope) {
      throw new Error(`invalid scope value: ${JSON.stringify(resultFetchScope)}`);
    }
    const permissionLabelList = {};
    const scopeList = resultFetchScope.result.scope.split(",");
    if (scopeList.length === 0) {
      return permissionLabelList;
    }
    scopeList.forEach((scope) => {
      permissionLabelList[scope] = _convertScopeToLabel({ scope, labelList: labelList2 });
    });
    return permissionLabelList;
  };
  var checkThrough = ({
    postThrough,
    notRequiredPermissionListElm,
    flipSvgElm,
    updateRequestScope: updateRequestScope2,
    updateScopeAlreadyChecked: updateScopeAlreadyChecked2,
    switchLoading: switchLoading2,
    redirect: redirect2,
    slideToggle: slideToggle2
  }) => {
    switchLoading2(true);
    return postThrough().then((result) => {
      switchLoading2(false);
      redirect2(result);
      updateRequestScope2({
        requestScope: result?.result?.requestScope,
        notRequiredPermissionListElm,
        flipSvgElm,
        slideToggle: slideToggle2
      });
      const oldPermissionList = result?.result?.oldPermissionList || {};
      updateScopeAlreadyChecked2({
        oldPermissionList
      });
      return result;
    });
  };
  var checkImportantPermissionWithModal = async ({
    permissionList,
    resultCheckTrough,
    scopeExtraConfigList: scopeExtraConfigList2,
    labelList: labelList2,
    showModal: showModal2,
    getErrorModalElmAndSetter: getErrorModalElmAndSetter2
  }) => {
    const { modalElm, setContent } = getErrorModalElmAndSetter2();
    const oldPermissionList = resultCheckTrough?.result?.oldPermissionList || {};
    for await (const [scope, isChecked] of Object.entries(permissionList)) {
      if (!isChecked) {
        continue;
      }
      if (oldPermissionList[scope]) {
        continue;
      }
      const scopeWithoutOperation = scope.split(":").slice(1).join(":");
      if (!scopeExtraConfigList2[scopeWithoutOperation] || !scopeExtraConfigList2[scopeWithoutOperation].dialogConfirm) {
        continue;
      }
      const { label } = _convertScopeToLabel({ labelList: labelList2, scope });
      setContent(`[${label}(${scope})]\u306F\u91CD\u8981\u306A\u6A29\u9650\u3067\u3059\u3002\u672C\u5F53\u306B\u8A31\u53EF\u3057\u307E\u3059\u304B\uFF1F`, null, "\u78BA\u8A8D");
      const isAuthorized = await showModal2(modalElm, true);
      if (!isAuthorized) {
        return false;
      }
    }
    return true;
  };

  // view/src/js/confirm/output.js
  var output_exports = {};
  __export(output_exports, {
    getAccordionElm: () => getAccordionElm,
    getConfirmFormElm: () => getConfirmFormElm,
    getPermissionCheckList: () => getPermissionCheckList,
    getPostConfirm: () => getPostConfirm,
    getPostThrough: () => getPostThrough,
    getRequiredPermissionCheckElmList: () => getRequiredPermissionCheckElmList,
    setConfirmFormSubmit: () => setConfirmFormSubmit,
    setOnCheckAllScopeButton: () => setOnCheckAllScopeButton,
    setOnClickShowOptionPermissionBtn: () => setOnClickShowOptionPermissionBtn,
    showPermissionLabelList: () => showPermissionLabelList,
    updateRequestScope: () => updateRequestScope,
    updateScopeAlreadyChecked: () => updateScopeAlreadyChecked
  });
  var showPermissionLabelList = ({
    permissionLabelList,
    getRandomStr: getRandomStr2,
    scopeExtraConfigList: scopeExtraConfigList2,
    onClickScopeDetailBtn
  }) => {
    const requiredPermissionListElm = document.querySelector("#requiredPermissionList");
    const notRequiredPermissionListElm = document.querySelector("#notRequiredPermissionList");
    const permissionCheckDetailButtonTemplateElm = document.querySelector("#permissionCheckDetailButtonTemplate");
    Object.entries(permissionLabelList).forEach(([scope, permission]) => {
      const inputElmId = `permissionCheck_${getRandomStr2(16)}`;
      const wrapElmId = `wrap_${inputElmId}`;
      const scopeWithoutOperation = scope.split(":").slice(1).join(":");
      const scopeExtraConfig = scopeExtraConfigList2[scopeWithoutOperation];
      let permissionCheckElm = null;
      if (scopeExtraConfig && scopeExtraConfig.templateId) {
        permissionCheckElm = document.querySelector(scopeExtraConfig.templateId).cloneNode(true);
      } else {
        permissionCheckElm = document.querySelector("#permissionCheckTemplate").cloneNode(true);
      }
      permissionCheckElm.classList.remove("hidden");
      permissionCheckElm.setAttribute("id", wrapElmId);
      const inputElm = permissionCheckElm.querySelector('[data-id="permissionCheckTemplateInput"]');
      inputElm.setAttribute("data-scope", scope);
      inputElm.setAttribute("id", inputElmId);
      inputElm.setAttribute("data-scope-is-required", permission.isRequired);
      if (permission.isRequired) {
        inputElm.setAttribute("required", true);
      }
      const labelElm = permissionCheckElm.querySelector('[data-id="permissionCheckTemplateInputLabel"]');
      labelElm.setAttribute("for", inputElmId);
      permission.labelNoWrapList.forEach((label) => {
        const noWrapElm = document.createElement("span");
        noWrapElm.classList.add("whitespace-nowrap");
        noWrapElm.innerText = label;
        labelElm.appendChild(noWrapElm);
      });
      const btnElm = permissionCheckElm.querySelector('[data-id="permissionCheckTemplateDetailBtn"]');
      btnElm.onclick = (e) => {
        e.preventDefault();
        const summaryWrapElm = document.createElement("div");
        summaryWrapElm.appendChild(document.createTextNode(permission.summary));
        const summaryLinkElm = permissionCheckDetailButtonTemplateElm.cloneNode(true);
        summaryLinkElm.setAttribute("href", `/scopeDetail#${scopeWithoutOperation}`);
        summaryLinkElm.classList.remove("hidden");
        summaryWrapElm.appendChild(summaryLinkElm);
        onClickScopeDetailBtn("\u6A29\u9650\u306E\u8AAC\u660E", summaryWrapElm);
      };
      if (permission.isRequired) {
        requiredPermissionListElm.insertBefore(permissionCheckElm, requiredPermissionListElm.children[requiredPermissionListElm.children.length - 1]);
      } else {
        notRequiredPermissionListElm.insertBefore(permissionCheckElm, notRequiredPermissionListElm.children[notRequiredPermissionListElm.children.length - 1]);
      }
    });
  };
  var updateRequestScope = ({
    requestScope,
    notRequiredPermissionListElm,
    flipSvgElm,
    slideToggle: slideToggle2
  }) => {
    const requestScopeInputElm = document.querySelector(`[data-scope="${requestScope}"]`);
    if (!requestScopeInputElm) {
      return;
    }
    requestScopeInputElm.parentNode.classList.add("bg-red-400");
    slideToggle2(notRequiredPermissionListElm, 300, true);
    if (!flipSvgElm.classList.contains("flipY")) {
      flipSvgElm.classList.add("flipY");
    }
  };
  var updateScopeAlreadyChecked = ({ oldPermissionList }) => {
    Object.values(document.querySelectorAll("[data-scope]")).forEach((elm) => {
      let { scope } = elm.dataset;
      if (scope.length > 0 && scope[0] === "*") {
        scope = scope.slice(1);
      }
      if (oldPermissionList[scope]) {
        elm.checked = true;
      }
    });
  };
  var getPermissionCheckList = () => {
    const permissionCheckList = {};
    Object.values(document.querySelectorAll("[data-scope]")).forEach((elm) => {
      let { scope } = elm.dataset;
      if (scope.length > 0 && scope[0] === "*") {
        scope = scope.slice(1);
      }
      permissionCheckList[scope] = elm.checked;
    });
    return permissionCheckList;
  };
  var getPostConfirm = ({ apiEndpoint: apiEndpoint2, postRequest: postRequest2 }) => {
    const url = `${apiEndpoint2}/confirm/permission/check`;
    return ({ permissionList }) => {
      const param = { permissionList };
      return postRequest2(url, param);
    };
  };
  var getConfirmFormElm = () => {
    const confirmFormElm = document.querySelector("#confirmForm");
    return confirmFormElm;
  };
  var setConfirmFormSubmit = ({ confirmFormElm, onSubmitConfirm }) => {
    confirmFormElm.onsubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmitConfirm();
    };
  };
  var getPostThrough = ({ apiEndpoint: apiEndpoint2, postRequest: postRequest2 }) => {
    const url = `${apiEndpoint2}/confirm/through/check`;
    return () => {
      const param = {};
      return postRequest2(url, param);
    };
  };
  var getRequiredPermissionCheckElmList = () => {
    const permissionCheckElmList = Object.values(document.querySelectorAll('[data-scope-is-required="true"]'));
    return permissionCheckElmList;
  };
  var setOnCheckAllScopeButton = ({ onClickCheckAllScopeButton }) => {
    const checkAllScopeBtnElm = document.querySelector("#checkAllScopeBtn");
    checkAllScopeBtnElm.onclick = onClickCheckAllScopeButton;
  };
  var getAccordionElm = () => {
    const notRequiredPermissionListElm = document.querySelector("#notRequiredPermissionList");
    const flipSvgElm = document.querySelector("#showOptionPermissionBtn svg");
    const showOptionPermissionBtnElm = document.querySelector("#showOptionPermissionBtn");
    return { notRequiredPermissionListElm, flipSvgElm, showOptionPermissionBtnElm };
  };
  var setOnClickShowOptionPermissionBtn = ({
    showOptionPermissionBtnElm,
    onClickShowOptionPermissionBtn,
    notRequiredPermissionListElm
  }) => {
    showOptionPermissionBtnElm.onclick = onClickShowOptionPermissionBtn;
    notRequiredPermissionListElm.onclick = (e) => {
      e.stopPropagation();
    };
  };

  // view/src/js/confirm/app.js
  var asocial = {};
  asocial.setting = setting_exports;
  asocial.lib = lib_exports;
  asocial.input = input_exports;
  asocial.action = action_exports;
  asocial.core = core_exports;
  asocial.output = output_exports;
  var a = asocial;
  var loadAllPermissionList = async () => {
    const resultFetchScope = await a.input.fetchScope(argNamed({
      setting: a.setting.bsc.get("apiEndpoint"),
      lib: [a.lib.getRequest]
    }));
    const permissionLabelList = a.core.convertPermissionList(argNamed({
      setting: a.setting.bsc.get("labelList"),
      other: { resultFetchScope }
    }));
    const onClickScopeDetailBtn = a.action.getOnClickScopeDetailBtn(argNamed({
      lib: [a.lib.showModal, a.lib.getModalElmAndSetter]
    }));
    a.output.showPermissionLabelList(argNamed({
      setting: a.setting.get("scopeExtraConfigList"),
      setting2: a.setting.bsc.get("labelList"),
      lib: [a.lib.getRandomStr],
      other: { permissionLabelList, onClickScopeDetailBtn }
    }));
  };
  var loadConfirmForm = ({ resultCheckTrough }) => {
    const postConfirm = a.output.getPostConfirm(argNamed({
      lib: [a.lib.postRequest],
      setting: a.setting.bsc.get("apiEndpoint")
    }));
    const onSubmitConfirm = a.action.getOnSubmitConfirm(argNamed({
      output: [a.output.getPermissionCheckList],
      core: [a.core.checkImportantPermissionWithModal],
      setting: a.setting.get("scopeExtraConfigList"),
      setting2: a.setting.bsc.get("labelList"),
      lib: [a.lib.switchLoading, a.lib.redirect, a.lib.showModal, a.lib.getErrorModalElmAndSetter],
      other: { postConfirm, resultCheckTrough }
    }));
    const confirmFormElm = a.output.getConfirmFormElm();
    a.output.setConfirmFormSubmit(argNamed({
      elm: { confirmFormElm },
      onSubmit: { onSubmitConfirm }
    }));
  };
  var loadCheckAllScopeButton = () => {
    const onClickCheckAllScopeButton = a.action.getOnClickCheckAllScopeButton(argNamed({
      output: [a.output.getRequiredPermissionCheckElmList]
    }));
    a.output.setOnCheckAllScopeButton(argNamed({
      onClick: { onClickCheckAllScopeButton }
    }));
  };
  var startThroughCheck = async () => {
    const postThrough = a.output.getPostThrough(argNamed({
      lib: [a.lib.postRequest],
      setting: a.setting.bsc.get("apiEndpoint")
    }));
    const { notRequiredPermissionListElm, flipSvgElm } = a.output.getAccordionElm();
    const resultCheckTrough = a.core.checkThrough(argNamed({
      param: { postThrough, notRequiredPermissionListElm, flipSvgElm },
      output: [a.output.updateRequestScope, a.output.updateScopeAlreadyChecked],
      lib: [a.lib.switchLoading, a.lib.redirect, a.lib.slideToggle]
    }));
    return resultCheckTrough;
  };
  var loadNotRequiredPermissionListAccordion = async () => {
    const { notRequiredPermissionListElm, flipSvgElm, showOptionPermissionBtnElm } = a.output.getAccordionElm();
    const onClickShowOptionPermissionBtn = a.action.getOnClickShowOptionPermissionBtn(argNamed({
      elm: { notRequiredPermissionListElm, flipSvgElm },
      lib: [a.lib.slideToggle]
    }));
    a.output.setOnClickShowOptionPermissionBtn(argNamed({
      elm: { notRequiredPermissionListElm, showOptionPermissionBtnElm },
      onClick: { onClickShowOptionPermissionBtn }
    }));
  };
  var main = async () => {
    a.lib.switchLoading(true);
    a.lib.setOnClickNavManu();
    a.lib.setOnClickNotification(a.setting.bsc.apiEndpoint);
    a.lib.monkeyPatch();
    await a.app.loadAllPermissionList();
    a.app.loadCheckAllScopeButton();
    await a.app.loadNotRequiredPermissionListAccordion();
    const resultCheckTrough = await a.app.startThroughCheck();
    a.app.loadConfirmForm({ resultCheckTrough });
  };
  a.app = {
    main,
    loadAllPermissionList,
    loadConfirmForm,
    loadCheckAllScopeButton,
    loadNotRequiredPermissionListAccordion,
    startThroughCheck
  };
  a.app.main();
})();
