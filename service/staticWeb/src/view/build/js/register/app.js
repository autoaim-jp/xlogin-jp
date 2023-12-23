(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // view/src/js/_setting/browserServerSetting.js
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
        json_v1: {
          label: "\u30C6\u30AD\u30B9\u30C8",
          summary: "\u9023\u643A\u3059\u308B\u30B5\u30FC\u30D3\u30B9\u3067\u3001\u3042\u306A\u305F\u304C\u30C7\u30FC\u30BF\u3092\u4FDD\u5B58\u3067\u304D\u307E\u3059\u3002"
        },
        file_v1: {
          label: "\u30D5\u30A1\u30A4\u30EB",
          summary: "\u9023\u643A\u3059\u308B\u30B5\u30FC\u30D3\u30B9\u3067\u3001\u3042\u306A\u305F\u304C\u30C7\u30FC\u30BF\u3092\u4FDD\u5B58\u3067\u304D\u307E\u3059\u3002"
        },
        chatgpt: {
          label: "ChatGPT",
          summary: "\u9023\u643A\u3059\u308B\u30B5\u30FC\u30D3\u30B9\u3067\u3001ChatGPT\u3092\u5229\u7528\u3059\u308B\u305F\u3081\u306E\u6A29\u9650\u3067\u3059\u3002"
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
    INVALID_CREDENTIAL: 1003,
    API_ERROR: 1100,
    INVALID_OIDC_ISSUER: 1101,
    NOT_FOUND: 1200,
    SERVER_ERROR: 1300
  };
  var userReadableDateFormat = {
    full: "YYYY/MM/DD hh:mm:ss",
    day: "YYYY/MM/DD",
    hourMinute: "hh:mm",
    time: "hh:mm:ss"
  };
  var setting = {
    apiEndpoint,
    labelList,
    statusList,
    userReadableDateFormat
  };
  var getList = /* @__PURE__ */ __name((...keyList) => {
    const constantList = keyList.reduce((prev, key) => {
      let value = setting;
      for (const keySplit of key.split(".")) {
        value = value[keySplit];
      }
      prev[key.slice(key.lastIndexOf(".") + 1)] = value;
      return prev;
    }, {});
    for (const key of keyList) {
      if (constantList[key.slice(key.lastIndexOf(".") + 1)] === void 0) {
        throw new Error(`[error] undefined setting constant: ${key}`);
      }
    }
    return constantList;
  }, "getList");
  var getValue = /* @__PURE__ */ __name((key) => {
    let value = setting;
    for (const keySplit of key.split(".")) {
      value = value[keySplit];
    }
    return value;
  }, "getValue");
  var browserServerSetting_default = {
    getList,
    getValue
  };

  // view/src/js/_setting/index.js
  var userHmacSecret = "xlogin20220630";
  var scopeExtraConfigList = {
    "auth:backupEmailAddress": {
      templateId: "#permissionCheckBlackTemplate",
      dialogConfirm: true
    }
  };
  var setting2 = {
    userHmacSecret,
    scopeExtraConfigList
  };
  var getList2 = /* @__PURE__ */ __name((...keyList) => {
    const constantList = keyList.reduce((prev, key) => {
      let value = setting2;
      for (const keySplit of key.split(".")) {
        value = value[keySplit];
      }
      prev[key.slice(key.lastIndexOf(".") + 1)] = value;
      return prev;
    }, {});
    for (const key of keyList) {
      if (constantList[key.slice(key.lastIndexOf(".") + 1)] === void 0) {
        throw new Error(`[error] undefined setting constant: ${key}`);
      }
    }
    return constantList;
  }, "getList");
  var getValue2 = /* @__PURE__ */ __name((key) => {
    let value = setting2;
    for (const keySplit of key.split(".")) {
      value = value[keySplit];
    }
    return value;
  }, "getValue");
  var setting_default = {
    getList: getList2,
    getValue: getValue2,
    browserServerSetting: browserServerSetting_default
  };

  // view/src/js/_lib/index.js
  var lib_exports2 = {};
  __export(lib_exports2, {
    buf2Hex: () => buf2Hex,
    calcHmac512: () => calcHmac512,
    calcPbkdf2: () => calcPbkdf2,
    common: () => common,
    genSalt: () => genSalt,
    getCaller: () => getCaller,
    monkeyPatch: () => monkeyPatch,
    redirect: () => redirect,
    xdevkit: () => xdevkit
  });

  // view/src/js/_lib/_xdevkit/index.js
  var xdevkit_exports = {};
  __export(xdevkit_exports, {
    lib: () => lib,
    output: () => output
  });

  // view/src/js/_lib/_xdevkit/lib.js
  var lib_exports = {};
  __export(lib_exports, {
    getRandomStr: () => getRandomStr,
    getSearchQuery: () => getSearchQuery
  });
  var getRandomStr = /* @__PURE__ */ __name((len) => {
    return btoa(crypto.getRandomValues(new Uint8Array(len))).slice(0, len);
  }, "getRandomStr");
  var getSearchQuery = /* @__PURE__ */ __name(() => {
    const searchQuery = {};
    window.location.search.replace(/^\?/, "").split("&").forEach((row) => {
      const kv = row.split("=");
      const [key, value] = kv;
      searchQuery[key] = value;
    });
    return searchQuery;
  }, "getSearchQuery");

  // view/src/js/_lib/_xdevkit/output.js
  var output_exports = {};
  __export(output_exports, {
    applyElmList: () => applyElmList,
    createTabMenuContainer: () => createTabMenuContainer,
    getErrorModalElmAndSetter: () => getErrorModalElmAndSetter,
    reloadXloginLoginBtn: () => reloadXloginLoginBtn,
    showModal: () => showModal,
    showTabButton: () => showTabButton,
    switchLoading: () => switchLoading
  });
  var applyElmList = /* @__PURE__ */ __name((query, f, parent = document) => {
    Object.values(parent.querySelectorAll(query)).forEach((elm) => {
      f(elm);
    });
  }, "applyElmList");
  var _closeModal = /* @__PURE__ */ __name(() => {
    applyElmList('[data-id="modal"], #modalBackground', (elm) => {
      elm.classList.add("hidden");
    });
  }, "_closeModal");
  var showModal = /* @__PURE__ */ __name((modalElm, cancelButtonIsVisible = false) => {
    return new Promise((resolve) => {
      if (modalElm.id === "modalTemplate") {
        modalElm.id = "";
      }
      document.body.appendChild(modalElm);
      _closeModal();
      setTimeout(() => {
        applyElmList('[data-id="modalClose"], [data-id="modalCancelButton"]', (elm) => {
          elm.onclick = () => {
            _closeModal();
            return resolve(false);
          };
        }, document);
        if (cancelButtonIsVisible) {
          modalElm.querySelector('[data-id="modalCancelButton"]').classList.remove("hidden");
        } else {
          modalElm.querySelector('[data-id="modalCancelButton"]').classList.add("hidden");
        }
        modalElm.querySelector('[data-id="modalConfirmButton"]').onclick = () => {
          _closeModal();
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
          _closeModal();
          return resolve(false);
        };
      }, 100);
    });
  }, "showModal");
  var getErrorModalElmAndSetter = /* @__PURE__ */ __name(() => {
    const modalTemplateElm = document.querySelector("#modalTemplate");
    const modalElm = modalTemplateElm.cloneNode(true);
    const modalTitleElm = modalElm.querySelector('[data-id="modalTitle"]');
    modalTitleElm.innerText = "\u30A8\u30E9\u30FC";
    const labelP = document.createElement("p");
    labelP.innerText = "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002";
    modalElm.querySelector('[data-id="modalContent"]').appendChild(labelP);
    const setContent = /* @__PURE__ */ __name((textStr, errorLabelList = null, title = "\u30A8\u30E9\u30FC") => {
      if (errorLabelList) {
        labelP.innerText = errorLabelList[textStr] || textStr;
      } else {
        labelP.innerText = textStr;
      }
      modalTitleElm.innerText = title;
    }, "setContent");
    return { modalElm, setContent };
  }, "getErrorModalElmAndSetter");
  var createTabMenuContainer = /* @__PURE__ */ __name(() => {
    const tabMenuContainerElm = document.querySelector("#tabMenuContainerTemplate").cloneNode(true);
    tabMenuContainerElm.id = "";
    tabMenuContainerElm.classList.remove("hidden");
    return tabMenuContainerElm;
  }, "createTabMenuContainer");
  var _showTabContainer = /* @__PURE__ */ __name(({ activeTabContainerId, tabList }) => {
    Object.keys(tabList).forEach((tabContainerId) => {
      const tabContainerElm2 = document.querySelector(`#${tabContainerId}`);
      tabContainerElm2.classList.add("hidden");
    });
    const tabContainerElm = document.querySelector(`#${activeTabContainerId}`);
    tabContainerElm.classList.remove("hidden");
  }, "_showTabContainer");
  var showTabButton = /* @__PURE__ */ __name(({ tabMenuContainerElm, tabList, activeTabContainerId }) => {
    const getOnClickTabButton = /* @__PURE__ */ __name(({ newActiveTabContainerId }) => {
      return (e) => {
        if (e) {
          e.preventDefault();
        }
        showTabButton({ tabMenuContainerElm, tabList, activeTabContainerId: newActiveTabContainerId });
        _showTabContainer({ tabList, activeTabContainerId: newActiveTabContainerId });
      };
    }, "getOnClickTabButton");
    tabMenuContainerElm.clearChildren();
    Object.entries(tabList).forEach(([tabContainerId, value]) => {
      let tabItemElm = null;
      if (tabContainerId === activeTabContainerId) {
        tabItemElm = document.querySelector("#tabActiveItemTemplate").cloneNode(true);
      } else {
        tabItemElm = document.querySelector("#tabItemTemplate").cloneNode(true);
      }
      tabItemElm.id = "";
      tabItemElm.classList.remove("hidden");
      tabItemElm.children[0].innerText = value;
      tabItemElm.children[0].onclick = getOnClickTabButton({ newActiveTabContainerId: tabContainerId });
      tabMenuContainerElm.appendChild(tabItemElm);
      if (tabContainerId === activeTabContainerId) {
        _showTabContainer({ tabList, activeTabContainerId: tabContainerId });
      }
    });
  }, "showTabButton");
  var switchLoading = /* @__PURE__ */ __name((isVisible) => {
    const loadingElm = document.querySelector("#loading");
    if (!loadingElm) {
      return;
    }
    if (isVisible) {
      loadingElm.classList.remove("hidden");
    } else {
      loadingElm.classList.add("hidden");
    }
  }, "switchLoading");
  var reloadXloginLoginBtn = /* @__PURE__ */ __name((clientId) => {
    const getOnClickXloginButtonHandler = /* @__PURE__ */ __name(() => {
      const handler = /* @__PURE__ */ __name((elm) => {
        const { permission } = elm.dataset;
        let queryPart = "";
        if (permission !== void 0) {
          queryPart += `&requestScope=${permission.replace(/\$CLIENT_ID/g, clientId)}`;
        }
        return () => {
          window.location.href = `/f/xlogin/connect?redirectAfterAuth=/mypage${queryPart}`;
        };
      }, "handler");
      return handler;
    }, "getOnClickXloginButtonHandler");
    const setOnClickXloginButton = /* @__PURE__ */ __name(({ onClickXloginButtonHandler: onClickXloginButtonHandler2 }) => {
      document.querySelectorAll('[data-id="xloginLoginBtn"]').forEach((elm) => {
        elm.onclick = onClickXloginButtonHandler2(elm);
      });
    }, "setOnClickXloginButton");
    const onClickXloginButtonHandler = getOnClickXloginButtonHandler();
    setOnClickXloginButton({ onClickXloginButtonHandler });
  }, "reloadXloginLoginBtn");

  // view/src/js/_lib/_xdevkit/index.js
  var lib = lib_exports;
  var output = output_exports;

  // view/src/js/_lib/_common/index.js
  var common_exports = {};
  __export(common_exports, {
    input: () => input,
    output: () => output2
  });

  // view/src/js/_lib/_common/output.js
  var output_exports2 = {};
  __export(output_exports2, {
    getModalElmAndSetter: () => getModalElmAndSetter,
    postRequest: () => postRequest,
    setOnClickNavManu: () => setOnClickNavManu,
    setOnClickNotification: () => setOnClickNotification,
    showGlobalNotification: () => showGlobalNotification,
    slideDown: () => slideDown,
    slideToggle: () => slideToggle,
    slideUp: () => slideUp
  });
  var postRequest = /* @__PURE__ */ __name((url, param = {}) => {
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
  }, "postRequest");
  var setOnClickNavManu = /* @__PURE__ */ __name(() => {
    const toggleElm = document.querySelector("#commonNavToggle");
    const navContentElm = document.querySelector("#commonNavContent");
    toggleElm.onclick = () => {
      if ([...navContentElm.classList.values()].indexOf("hidden") >= 0) {
        navContentElm.classList.remove("hidden");
      } else {
        navContentElm.classList.add("hidden");
      }
    };
  }, "setOnClickNavManu");
  var notificationIsVisible = false;
  var showGlobalNotification = /* @__PURE__ */ __name(async (apiEndpoint2, getRequest2, showModal2) => {
    const durationShow = 0.5;
    const durationHide = 0.2;
    const resultFetchGlobalNotification = await getRequest2(`${apiEndpoint2}/notification/global/list`);
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
        showModal2(modalElm);
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
  }, "showGlobalNotification");
  var setOnClickNotification = /* @__PURE__ */ __name((apiEndpoint2, applyElmList2, getRequest2, showModal2) => {
    applyElmList2('[data-id="notificationBtn"]', (notificationBtn) => {
      notificationBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (notificationIsVisible) {
          return;
        }
        notificationIsVisible = true;
        showGlobalNotification(apiEndpoint2, getRequest2, showModal2);
      };
    });
  }, "setOnClickNotification");
  var getModalElmAndSetter = /* @__PURE__ */ __name(() => {
    const modalTemplateElm = document.querySelector("#modalTemplate");
    const modalElm = modalTemplateElm.cloneNode(true);
    const modalTitleElm = modalElm.querySelector('[data-id="modalTitle"]');
    const modalContentElm = modalElm.querySelector('[data-id="modalContent"]');
    const setContentElm = /* @__PURE__ */ __name((title, contentElm) => {
      modalTitleElm.innerText = title;
      modalContentElm.clearChildren();
      modalContentElm.appendChild(contentElm);
    }, "setContentElm");
    return { modalElm, setContentElm };
  }, "getModalElmAndSetter");
  var slideUp = /* @__PURE__ */ __name((elm, duration = 300) => {
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
  }, "slideUp");
  var slideDown = /* @__PURE__ */ __name((elm, duration = 300) => {
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
  }, "slideDown");
  var slideToggle = /* @__PURE__ */ __name((elm, duration = 300, ignoreIfOpen = false) => {
    if (window.getComputedStyle(elm).display === "none") {
      slideDown(elm, duration);
    } else if (!ignoreIfOpen) {
      slideUp(elm, duration);
    }
  }, "slideToggle");

  // view/src/js/_lib/_common/input.js
  var input_exports = {};
  __export(input_exports, {
    fetchSplitPermissionList: () => fetchSplitPermissionList,
    getRequest: () => getRequest
  });
  var getRequest = /* @__PURE__ */ __name((_url, param = {}) => {
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
  }, "getRequest");
  var fetchSplitPermissionList = /* @__PURE__ */ __name((apiEndpoint2) => {
    const url = `${apiEndpoint2}/session/splitPermissionList`;
    return getRequest(url);
  }, "fetchSplitPermissionList");

  // view/src/js/_lib/_common/index.js
  var output2 = output_exports2;
  var input = input_exports;

  // view/src/js/_lib/index.js
  var xdevkit = xdevkit_exports;
  var common = common_exports;
  var getCaller = /* @__PURE__ */ __name(() => {
    const callerInfo = new Error().stack.replace(/^Error\n.*\n.*\n/, "");
    return callerInfo;
  }, "getCaller");
  var monkeyPatch = /* @__PURE__ */ __name(() => {
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
  }, "monkeyPatch");
  var redirect = /* @__PURE__ */ __name((response) => {
    if (response && response.redirect) {
      window.location.href = response.redirect;
    }
  }, "redirect");
  var buf2Hex = /* @__PURE__ */ __name((buf) => {
    return Array.prototype.map.call(new Uint8Array(buf), (x) => {
      return `00${x.toString(16)}`.slice(-2);
    }).join("");
  }, "buf2Hex");
  var calcHmac512 = /* @__PURE__ */ __name((data, secret) => {
    return new Promise((resolve) => {
      const enc = new TextEncoder("utf-8");
      window.crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        {
          name: "HMAC",
          hash: { name: "SHA-512" }
        },
        false,
        ["sign", "verify"]
      ).then((key) => {
        window.crypto.subtle.sign(
          "HMAC",
          key,
          enc.encode(data)
        ).then((hash) => {
          const buf = new Uint8Array(hash);
          resolve(buf2Hex(buf));
        });
      });
    });
  }, "calcHmac512");
  var genSalt = /* @__PURE__ */ __name(() => {
    return window.crypto.getRandomValues(new Uint8Array(64));
  }, "genSalt");
  var calcPbkdf2 = /* @__PURE__ */ __name((str, salt) => {
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
  }, "calcPbkdf2");

  // view/src/js/register/action.js
  var action_exports = {};
  __export(action_exports, {
    default: () => action_default,
    getOnSubmitRegister: () => getOnSubmitRegister
  });
  var getOnSubmitRegister = /* @__PURE__ */ __name(({
    userHmacSecret: userHmacSecret2,
    labelList: labelList2,
    emailAddressInputElm,
    passInputElm,
    tosCheckElm,
    privacyPolicyCheckElm,
    calcHmac512: calcHmac5122,
    genSalt: genSalt2,
    calcPbkdf2: calcPbkdf22,
    buf2Hex: buf2Hex2,
    switchLoading: switchLoading2,
    redirect: redirect2,
    postRegister,
    getErrorModalElmAndSetter: getErrorModalElmAndSetter2,
    showModal: showModal2
  }) => {
    const { modalElm, setContent } = getErrorModalElmAndSetter2();
    return async () => {
      switchLoading2(true);
      const emailAddress = emailAddressInputElm.value;
      const pass = passInputElm.value;
      const isTosChecked = tosCheckElm.checked;
      const isPrivacyPolicyChecked = privacyPolicyCheckElm.checked;
      const passHmac1 = await calcHmac5122(pass, userHmacSecret2);
      const passHmac2 = await calcHmac5122(passHmac1, userHmacSecret2);
      const salt = genSalt2();
      const passPbkdf2 = await calcPbkdf22(passHmac2, salt);
      const saltHex = buf2Hex2(salt);
      postRegister({
        emailAddress,
        passPbkdf2,
        saltHex,
        isTosChecked,
        isPrivacyPolicyChecked
      }).then((result) => {
        switchLoading2(false);
        if (result.error) {
          setContent(result.error, labelList2.error);
          showModal2(modalElm, false);
        } else {
          redirect2(result);
        }
      });
    };
  }, "getOnSubmitRegister");
  var action_default = {};

  // view/src/js/register/output.js
  var output_exports3 = {};
  __export(output_exports3, {
    getPostRegister: () => getPostRegister,
    getRegisterFormElm: () => getRegisterFormElm,
    setRegisterFormSubmit: () => setRegisterFormSubmit
  });
  var getPostRegister = /* @__PURE__ */ __name(({ apiEndpoint: apiEndpoint2, postRequest: postRequest2 }) => {
    const url = `${apiEndpoint2}/login/user/add`;
    return ({
      emailAddress,
      passPbkdf2,
      saltHex,
      isTosChecked,
      isPrivacyPolicyChecked
    }) => {
      const param = {
        emailAddress,
        passPbkdf2,
        saltHex,
        isTosChecked,
        isPrivacyPolicyChecked
      };
      return postRequest2(url, param);
    };
  }, "getPostRegister");
  var getRegisterFormElm = /* @__PURE__ */ __name(() => {
    const emailAddressInputElm = document.querySelector("#emailAddressInput");
    const passInputElm = document.querySelector("#passInput");
    const tosCheckElm = document.querySelector("#tosCheck");
    const privacyPolicyCheckElm = document.querySelector("#privacyPolicyCheck");
    return {
      emailAddressInputElm,
      passInputElm,
      tosCheckElm,
      privacyPolicyCheckElm
    };
  }, "getRegisterFormElm");
  var setRegisterFormSubmit = /* @__PURE__ */ __name(({ onSubmitRegister }) => {
    const registerFormElm = document.querySelector("#registerForm");
    registerFormElm.onsubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmitRegister();
    };
  }, "setRegisterFormSubmit");

  // view/src/js/register/app.js
  var asocial = {};
  asocial.setting = setting_default;
  asocial.lib = lib_exports2;
  asocial.action = action_exports;
  asocial.output = output_exports3;
  var a = asocial;
  var loadRegisterForm = /* @__PURE__ */ __name(() => {
    const postRegister = a.output.getPostRegister(argNamed({
      browserServerSetting: a.setting.browserServerSetting.getList("apiEndpoint"),
      lib: [a.lib.common.output.postRequest]
    }));
    const {
      emailAddressInputElm,
      passInputElm,
      tosCheckElm,
      privacyPolicyCheckElm
    } = a.output.getRegisterFormElm();
    const onSubmitRegister = a.action.getOnSubmitRegister(argNamed({
      browserServerSetting: a.setting.browserServerSetting.getList("labelList"),
      setting: a.setting.getList("userHmacSecret"),
      elm: {
        emailAddressInputElm,
        passInputElm,
        tosCheckElm,
        privacyPolicyCheckElm
      },
      other: { postRegister },
      lib: [a.lib.calcHmac512, a.lib.genSalt, a.lib.calcPbkdf2, a.lib.buf2Hex, a.lib.xdevkit.output.switchLoading, a.lib.redirect, a.lib.xdevkit.output.showModal, a.lib.xdevkit.output.getErrorModalElmAndSetter]
    }));
    a.output.setRegisterFormSubmit(argNamed({
      onSubmit: { onSubmitRegister }
    }));
  }, "loadRegisterForm");
  var main = /* @__PURE__ */ __name(async () => {
    a.lib.xdevkit.output.switchLoading(true);
    a.lib.common.output.setOnClickNavManu();
    a.lib.common.output.setOnClickNotification(a.setting.browserServerSetting.getValue("apiEndpoint"), a.lib.xdevkit.output.applyElmList, a.lib.common.input.getRequest, a.lib.xdevkit.output.showModal);
    a.lib.monkeyPatch();
    a.app.loadRegisterForm();
    setTimeout(() => {
      a.lib.xdevkit.output.switchLoading(false);
    }, 300);
  }, "main");
  a.app = {
    loadRegisterForm,
    main
  };
  a.app.main();
})();
