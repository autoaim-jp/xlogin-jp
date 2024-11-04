(()=>{var n=Object.defineProperty,t=(e,t)=>n(e,"name",{value:t,configurable:!0}),e=(e,t)=>{for(var o in t)n(e,o,{get:t[o],enumerable:!0})},r={apiEndpoint:"/f",labelList:{scopeBody:{global:{notification:{label:"すべての通知",summary:"すべてのサービスの通知に関する権限です。ログイン時刻などを含みます。"}},auth:{emailAddress:{label:"メールアドレス",summary:"ログインに使用するメールアドレスに関する権限です。バックアップメールアドレスは含みません。"},backupEmailAddress:{label:"バックアップメールアドレス",summary:"バックアップメールアドレスに関する権限です。ログインに使用するメールアドレスは含みません。"},userName:{label:"ユーザー名",summary:"一般公開されているユーザーの名前です。"}},service:{serviceUserId:{label:"ユーザーID",summary:"連携するサービスに提供する、あなたのアカウントのIDです。サービス毎に異なります。"},notification:{label:"サービス内通知",summary:"連携するサービス内で、通知機能を利用するための権限です。"},json_v1:{label:"テキスト",summary:"連携するサービスで、あなたがデータを保存できます。"},file_v1:{label:"ファイル",summary:"連携するサービスで、あなたがデータを保存できます。"},chatgpt:{label:"ChatGPT",summary:"連携するサービスで、ChatGPTを利用するための権限です。"},text_lib_v1:{label:"テキスト変換",summary:"連携するサービスで、テキスト変換機能を利用するための権限です。"},tesseract:{label:"OCR",summary:"連携するサービスで、OCRを利用するための権限です。"}}},scopeOperation:{operation:{read:"取得",write:"保存",append:"追記"},prefix:{isRequired:"必須"}},error:{undefined:"error",handle_credential_credential:"メールアドレスまたはパスワードが違います。",handle_user_add_register:"メールアドレスは既に登録されています。",handle_xlogin_code_session:"セッションが不正です。"}},statusList:{OK:1,SUCCESS:100,LOGIN_SUCCESS:101,INVALID:1e3,NOT_ENOUGH_PARAM:1001,INVALID_SESSION:1002,INVALID_CREDENTIAL:1003,API_ERROR:1100,INVALID_OIDC_ISSUER:1101,NOT_FOUND:1200,SERVER_ERROR:1300},userReadableDateFormat:{full:"YYYY/MM/DD hh:mm:ss",day:"YYYY/MM/DD",hourMinute:"hh:mm",time:"hh:mm:ss"}},o={getList:t((...e)=>{var t=e.reduce((e,t)=>{let o=r;for(const n of t.split("."))o=o[n];return e[t.slice(t.lastIndexOf(".")+1)]=o,e},{});for(const o of e)if(void 0===t[o.slice(o.lastIndexOf(".")+1)])throw new Error("[error] undefined setting constant: "+o);return t},"getList"),getValue:t(e=>{let t=r;for(const o of e.split("."))t=t[o];return t},"getValue")},i={userHmacSecret:"xlogin20220630",scopeExtraConfigList:{"auth:backupEmailAddress":{templateId:"#permissionCheckBlackTemplate",dialogConfirm:!0}}},o={getList:t((...e)=>{var t=e.reduce((e,t)=>{let o=i;for(const n of t.split("."))o=o[n];return e[t.slice(t.lastIndexOf(".")+1)]=o,e},{});for(const o of e)if(void 0===t[o.slice(o.lastIndexOf(".")+1)])throw new Error("[error] undefined setting constant: "+o);return t},"getList"),getValue:t(e=>{let t=i;for(const o of e.split("."))t=t[o];return t},"getValue"),browserServerSetting:o},a={},l=(e(a,{buf2Hex:()=>B,calcHmac512:()=>G,calcPbkdf2:()=>X,common:()=>H,genSalt:()=>F,getCaller:()=>U,monkeyPatch:()=>V,redirect:()=>Y,xdevkit:()=>j}),{}),s=(e(l,{lib:()=>w,output:()=>S}),{}),d=(e(s,{getRandomStr:()=>d,getSearchQuery:()=>c}),t(e=>btoa(crypto.getRandomValues(new Uint8Array(e))).slice(0,e),"getRandomStr")),c=t(()=>{const o={};return window.location.search.replace(/^\?/,"").split("&").forEach(e=>{var[e,t]=e.split("=");o[e]=t}),o},"getSearchQuery"),m={},u=(e(m,{applyElmList:()=>u,createTabMenuContainer:()=>h,getErrorModalElmAndSetter:()=>g,reloadXloginLoginBtn:()=>C,showModal:()=>y,showTabButton:()=>b,switchLoading:()=>v}),t((e,t,o=document)=>{Object.values(o.querySelectorAll(e)).forEach(e=>{t(e)})},"applyElmList")),p=t(()=>{u('[data-id="modal"], #modalBackground',e=>{e.classList.add("hidden")})},"_closeModal"),y=t((e,o=!1)=>new Promise(t=>{"modalTemplate"===e.id&&(e.id=""),document.body.appendChild(e),p(),setTimeout(()=>{u('[data-id="modalClose"], [data-id="modalCancelButton"]',e=>{e.onclick=()=>(p(),t(!1))},document),o?e.querySelector('[data-id="modalCancelButton"]').classList.remove("hidden"):e.querySelector('[data-id="modalCancelButton"]').classList.add("hidden"),e.querySelector('[data-id="modalConfirmButton"]').onclick=()=>(p(),t(!0)),e.classList.remove("hidden"),document.querySelector("#modalBackground").classList.remove("hidden"),e.querySelector('[data-id="modalContent"]').scrollTop=0,e.querySelector('[data-id="modalCard"]').onclick=e=>{e.stopPropagation()},e.onclick=e=>(e.stopPropagation(),p(),t(!1))},100)}),"showModal"),g=t(()=>{var e=document.querySelector("#modalTemplate").cloneNode(!0);const n=e.querySelector('[data-id="modalTitle"]'),r=(n.innerText="エラー",document.createElement("p"));return r.innerText="エラーが発生しました。",e.querySelector('[data-id="modalContent"]').appendChild(r),{modalElm:e,setContent:t((e,t=null,o="エラー")=>{r.innerText=t&&t[e]||e,n.innerText=o},"setContent")}},"getErrorModalElmAndSetter"),h=t(()=>{var e=document.querySelector("#tabMenuContainerTemplate").cloneNode(!0);return e.id="",e.classList.remove("hidden"),e},"createTabMenuContainer"),f=t(({activeTabContainerId:e,tabList:t})=>{Object.keys(t).forEach(e=>{document.querySelector("#"+e).classList.add("hidden")}),document.querySelector("#"+e).classList.remove("hidden")},"_showTabContainer"),b=t(({tabMenuContainerElm:n,tabList:r,activeTabContainerId:i})=>{const a=t(({newActiveTabContainerId:t})=>e=>{e&&e.preventDefault(),b({tabMenuContainerElm:n,tabList:r,activeTabContainerId:t}),f({tabList:r,activeTabContainerId:t})},"getOnClickTabButton");n.clearChildren(),Object.entries(r).forEach(([e,t])=>{let o=null;(o=(e===i?document.querySelector("#tabActiveItemTemplate"):document.querySelector("#tabItemTemplate")).cloneNode(!0)).id="",o.classList.remove("hidden"),o.children[0].innerText=t,o.children[0].onclick=a({newActiveTabContainerId:e}),n.appendChild(o),e===i&&f({tabList:r,activeTabContainerId:e})})},"showTabButton"),v=t(e=>{var t=document.querySelector("#loading");t&&(e?t.classList.remove("hidden"):t.classList.add("hidden"))},"switchLoading"),C=t(o=>{var e=t(()=>{return t(e=>{e=e.dataset.permission;let t="";return void 0!==e&&(t+="&requestScope="+e.replace(/\$CLIENT_ID/g,o)),()=>{window.location.href="/f/xlogin/connect?redirectAfterAuth=/mypage"+t}},"handler")},"getOnClickXloginButtonHandler");t(({onClickXloginButtonHandler:t})=>{document.querySelectorAll('[data-id="xloginLoginBtn"]').forEach(e=>{e.onclick=t(e)})},"setOnClickXloginButton")({onClickXloginButtonHandler:e()})},"reloadXloginLoginBtn"),w=s,S=m,s={},m=(e(s,{input:()=>M,output:()=>_}),{}),T=(e(m,{getModalElmAndSetter:()=>O,postRequest:()=>T,setOnClickNavManu:()=>E,setOnClickNotification:()=>k,showGlobalNotification:()=>P,slideDown:()=>A,slideToggle:()=>N,slideUp:()=>q}),t((e,t={})=>{var o={method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},timeout:3e4};return t&&(o.body=JSON.stringify(t)),fetch(e,o).then(e=>!e.error&&e.body&&e.json?e.json():null).catch(e=>(console.error("[fatal] error @postRequest:",e),null))},"postRequest")),E=t(()=>{var e=document.querySelector("#commonNavToggle");const t=document.querySelector("#commonNavContent");e.onclick=()=>{0<=[...t.classList.values()].indexOf("hidden")?t.classList.remove("hidden"):t.classList.add("hidden")}},"setOnClickNavManu"),L=!1,P=t(async(e,t,n)=>{t=await t(e+"/notification/global/list");const r=document.querySelector("#notificationContainer"),i=(r.clearChildren(),document.querySelector("#notificationTemplate")),a=Object.values(t?.result?.globalNotificationList||{}).reverse();a.forEach((t,e)=>{const o=i.cloneNode(!0);o.classList.remove("hidden"),o.querySelector('[data-id="subject"]').innerText=t.subject,o.onclick=e=>{e.preventDefault(),e.stopPropagation();e=document.querySelector("#modalTemplate").cloneNode(!0);e.classList.remove("hidden"),e.querySelector('[data-id="modalTitle"]').innerText=t.subject,e.querySelector('[data-id="modalContent"]').appendChild(document.createTextNode(t.detail)),n(e)},setTimeout(()=>{o.style.transitionDuration="0.5s",o.style.opacity=0,r.appendChild(o),setTimeout(()=>{o.style.opacity=1},100)},.5*e*1e3),setTimeout(()=>{o.style.transitionDuration="0.2s",o.style.opacity=0},.5*a.length*1e3+3e3+.2*e*1e3)}),setTimeout(()=>{r.clearChildren(),L=!1},.7*a.length*1e3+3e3)},"showGlobalNotification"),k=t((t,e,o,n)=>{e('[data-id="notificationBtn"]',e=>{e.onclick=e=>{e.preventDefault(),e.stopPropagation(),L||(L=!0,P(t,o,n))}})},"setOnClickNotification"),O=t(()=>{var e=document.querySelector("#modalTemplate").cloneNode(!0);const o=e.querySelector('[data-id="modalTitle"]'),n=e.querySelector('[data-id="modalContent"]');return{modalElm:e,setContentElm:t((e,t)=>{o.innerText=e,n.clearChildren(),n.appendChild(t)},"setContentElm")}},"getModalElmAndSetter"),q=t((e,t=300)=>{e.style.height=e.offsetHeight+"px",null!==e.offsetHeight&&(e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.transitionTimingFunction="ease",e.style.overflow="hidden",e.style.height=0,e.style.paddingTop=0,e.style.paddingBottom=0,e.style.marginTop=0,e.style.marginBottom=0,setTimeout(()=>{e.style.display="none",e.style.removeProperty("height"),e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.style.removeProperty("transition-timing-function")},t))},"slideUp"),A=t((e,t=300)=>{e.style.removeProperty("display");let o=window.getComputedStyle(e)["display"];"none"===o&&(o="block"),e.style.display=o;var n=e.offsetHeight;e.style.overflow="hidden",e.style.height=0,e.style.paddingTop=0,e.style.paddingBottom=0,e.style.marginTop=0,e.style.marginBottom=0,null!==e.offsetHeight&&(e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.transitionTimingFunction="ease",e.style.height=n+"px",e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),setTimeout(()=>{e.style.removeProperty("height"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.style.removeProperty("transition-timing-function")},t))},"slideDown"),N=t((e,t=300,o=!1)=>{"none"===window.getComputedStyle(e).display?A(e,t):o||q(e,t)},"slideToggle"),x={},I=(e(x,{fetchSplitPermissionList:()=>R,getRequest:()=>I}),t((e,t={})=>{var o=t&&Object.keys(t).map(e=>e+"="+t[e]).join("&");return fetch(o?e+"?"+o:e,{method:"GET",credentials:"same-origin",timeout:3e4}).then(e=>!e.error&&e.body&&e.json?e.json():null).catch(e=>(console.error("[fatal] error @getRequest:",e),null))},"getRequest")),R=t(e=>{return I(e+"/session/splitPermissionList")},"fetchSplitPermissionList"),_=m,M=x,j=l,H=s,U=t(()=>{return(new Error).stack.replace(/^Error\n.*\n.*\n/,"")},"getCaller"),V=t(()=>{void 0===Element.prototype.clearChildren&&Object.defineProperty(Element.prototype,"clearChildren",{configurable:!0,enumerable:!1,value(){for(;this.firstChild;)this.removeChild(this.lastChild)}}),void 0===window.argNamed&&(window.argNamed=e=>{const t={};return Object.keys(e).forEach(o=>{Array.isArray(e[o])?Object.assign(t,e[o].reduce((e,t)=>{if(void 0===t)throw new Error(`[error] flat argument by list can only contain function but: ${typeof t} @${o}
===== maybe you need make func exported like  module.exports = { func, } =====`);if("function"!=typeof t)throw new Error(`[error] flat argument by list can only contain function but: ${typeof t} @`+o);return e[t.name]=t,e},{})):"object"==typeof e[o]&&null!==e[o]?Object.assign(t,e[o]):t[o]=e[o]}),t})},"monkeyPatch"),Y=t(e=>{e&&e.redirect&&(window.location.href=e.redirect)},"redirect"),B=t(e=>Array.prototype.map.call(new Uint8Array(e),e=>("00"+e.toString(16)).slice(-2)).join(""),"buf2Hex"),G=t((n,e)=>new Promise(t=>{const o=new TextEncoder("utf-8");window.crypto.subtle.importKey("raw",o.encode(e),{name:"HMAC",hash:{name:"SHA-512"}},!1,["sign","verify"]).then(e=>{window.crypto.subtle.sign("HMAC",e,o.encode(n)).then(e=>{e=new Uint8Array(e);t(B(e))})})}),"calcHmac512"),F=t(()=>window.crypto.getRandomValues(new Uint8Array(64)),"genSalt"),X=t((o,n)=>new Promise(t=>{var e=new Uint8Array(Array.prototype.map.call(o,e=>e.charCodeAt(0)));window.crypto.subtle.importKey("raw",e,{name:"PBKDF2"},!1,["deriveBits"]).then(e=>{return window.crypto.subtle.deriveBits({name:"PBKDF2",salt:n,iterations:1e6,hash:{name:"SHA-512"}},e,512).then(e=>{t(B(e))})})}),"calcPbkdf2"),e={},D=(e.setting=o,e.lib=a,e),m=t(async()=>{D.lib.xdevkit.output.switchLoading(!0),D.lib.common.output.setOnClickNavManu(),D.lib.common.output.setOnClickNotification(D.setting.browserServerSetting.getValue("apiEndpoint"),D.lib.xdevkit.output.applyElmList,D.lib.common.input.getRequest,D.lib.xdevkit.output.showModal),D.lib.monkeyPatch(),setTimeout(()=>{D.lib.xdevkit.output.switchLoading(!1)},300)},"main");D.app={main:m},D.app.main()})();