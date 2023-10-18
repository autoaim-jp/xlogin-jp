(()=>{var i=Object.defineProperty,t=(e,t)=>i(e,"name",{value:t,configurable:!0}),e=(e,t)=>{for(var o in t)i(e,o,{get:t[o],enumerable:!0})},r={apiEndpoint:"/f",labelList:{scopeBody:{global:{notification:{label:"すべての通知",summary:"すべてのサービスの通知に関する権限です。ログイン時刻などを含みます。"}},auth:{emailAddress:{label:"メールアドレス",summary:"ログインに使用するメールアドレスに関する権限です。バックアップメールアドレスは含みません。"},backupEmailAddress:{label:"バックアップメールアドレス",summary:"バックアップメールアドレスに関する権限です。ログインに使用するメールアドレスは含みません。"},userName:{label:"ユーザー名",summary:"一般公開されているユーザーの名前です。"}},service:{serviceUserId:{label:"ユーザーID",summary:"連携するサービスに提供する、あなたのアカウントのIDです。サービス毎に異なります。"},notification:{label:"サービス内通知",summary:"連携するサービス内で、通知機能を利用するための権限です。"},json_v1:{label:"テキスト",summary:"連携するサービスで、あなたがデータを保存できます。"},file_v1:{label:"ファイル",summary:"連携するサービスで、あなたがデータを保存できます。"}}},scopeOperation:{operation:{read:"取得",write:"保存",append:"追記"},prefix:{isRequired:"必須"}},error:{undefined:"error",handle_credential_credential:"メールアドレスまたはパスワードが違います。",handle_user_add_register:"メールアドレスは既に登録されています。",handle_xlogin_code_session:"セッションが不正です。"}},statusList:{OK:1,SUCCESS:100,LOGIN_SUCCESS:101,INVALID:1e3,NOT_ENOUGH_PARAM:1001,INVALID_SESSION:1002,INVALID_CREDENTIAL:1003,API_ERROR:1100,INVALID_OIDC_ISSUER:1101,NOT_FOUND:1200,SERVER_ERROR:1300},userReadableDateFormat:{full:"YYYY/MM/DD hh:mm:ss",day:"YYYY/MM/DD",hourMinute:"hh:mm",time:"hh:mm:ss"}},o={getList:t((...e)=>{var t=e.reduce((e,t)=>{let o=r;for(const i of t.split("."))o=o[i];return e[t.slice(t.lastIndexOf(".")+1)]=o,e},{});for(const o of e)if(void 0===t[o.slice(o.lastIndexOf(".")+1)])throw new Error("[error] undefined setting constant: "+o);return t},"getList"),getValue:t(e=>{let t=r;for(const o of e.split("."))t=t[o];return t},"getValue")},n={userHmacSecret:"xlogin20220630",scopeExtraConfigList:{"auth:backupEmailAddress":{templateId:"#permissionCheckBlackTemplate",dialogConfirm:!0}}},o={getList:t((...e)=>{var t=e.reduce((e,t)=>{let o=n;for(const i of t.split("."))o=o[i];return e[t.slice(t.lastIndexOf(".")+1)]=o,e},{});for(const o of e)if(void 0===t[o.slice(o.lastIndexOf(".")+1)])throw new Error("[error] undefined setting constant: "+o);return t},"getList"),getValue:t(e=>{let t=n;for(const o of e.split("."))t=t[o];return t},"getValue"),browserServerSetting:o},s={},l=(e(s,{buf2Hex:()=>N,calcHmac512:()=>$,calcPbkdf2:()=>X,common:()=>H,genSalt:()=>W,getCaller:()=>U,monkeyPatch:()=>Y,redirect:()=>V,xdevkit:()=>F}),{}),a=(e(l,{lib:()=>v,output:()=>L}),{}),c=(e(a,{getRandomStr:()=>c,getSearchQuery:()=>d}),t(e=>btoa(crypto.getRandomValues(new Uint8Array(e))).slice(0,e),"getRandomStr")),d=t(()=>{const o={};return window.location.search.replace(/^\?/,"").split("&").forEach(e=>{var[e,t]=e.split("=");o[e]=t}),o},"getSearchQuery"),m={},u=(e(m,{applyElmList:()=>u,createTabMenuContainer:()=>y,getErrorModalElmAndSetter:()=>g,reloadXloginLoginBtn:()=>C,showModal:()=>h,showTabButton:()=>b,switchLoading:()=>S}),t((e,t,o=document)=>{Object.values(o.querySelectorAll(e)).forEach(e=>{t(e)})},"applyElmList")),p=t(()=>{u('[data-id="modal"], #modalBackground',e=>{e.classList.add("hidden")})},"_closeModal"),h=t((e,o=!1)=>new Promise(t=>{"modalTemplate"===e.id&&(e.id=""),document.body.appendChild(e),p(),setTimeout(()=>{u('[data-id="modalClose"], [data-id="modalCancelButton"]',e=>{e.onclick=()=>(p(),t(!1))},document),o?e.querySelector('[data-id="modalCancelButton"]').classList.remove("hidden"):e.querySelector('[data-id="modalCancelButton"]').classList.add("hidden"),e.querySelector('[data-id="modalConfirmButton"]').onclick=()=>(p(),t(!0)),e.classList.remove("hidden"),document.querySelector("#modalBackground").classList.remove("hidden"),e.querySelector('[data-id="modalContent"]').scrollTop=0,e.querySelector('[data-id="modalCard"]').onclick=e=>{e.stopPropagation()},e.onclick=e=>(e.stopPropagation(),p(),t(!1))},100)}),"showModal"),g=t(()=>{var e=document.querySelector("#modalTemplate").cloneNode(!0);const i=e.querySelector('[data-id="modalTitle"]'),r=(i.innerText="エラー",document.createElement("p"));return r.innerText="エラーが発生しました。",e.querySelector('[data-id="modalContent"]').appendChild(r),{modalElm:e,setContent:t((e,t=null,o="エラー")=>{r.innerText=t&&t[e]||e,i.innerText=o},"setContent")}},"getErrorModalElmAndSetter"),y=t(()=>{var e=document.querySelector("#tabMenuContainerTemplate").cloneNode(!0);return e.id="",e.classList.remove("hidden"),e},"createTabMenuContainer"),f=t(({activeTabContainerId:e,tabList:t})=>{Object.keys(t).forEach(e=>{document.querySelector("#"+e).classList.add("hidden")}),document.querySelector("#"+e).classList.remove("hidden")},"_showTabContainer"),b=t(({tabMenuContainerElm:i,tabList:r,activeTabContainerId:n})=>{const s=t(({newActiveTabContainerId:t})=>e=>{e&&e.preventDefault(),b({tabMenuContainerElm:i,tabList:r,activeTabContainerId:t}),f({tabList:r,activeTabContainerId:t})},"getOnClickTabButton");i.clearChildren(),Object.entries(r).forEach(([e,t])=>{let o=null;(o=(e===n?document.querySelector("#tabActiveItemTemplate"):document.querySelector("#tabItemTemplate")).cloneNode(!0)).id="",o.classList.remove("hidden"),o.children[0].innerText=t,o.children[0].onclick=s({newActiveTabContainerId:e}),i.appendChild(o),e===n&&f({tabList:r,activeTabContainerId:e})})},"showTabButton"),S=t(e=>{var t=document.querySelector("#loading");t&&(e?t.classList.remove("hidden"):t.classList.add("hidden"))},"switchLoading"),C=t(o=>{var e=t(()=>{return t(e=>{e=e.dataset.permission;let t="";return void 0!==e&&(t+="&requestScope="+e.replace(/\$CLIENT_ID/g,o)),()=>{window.location.href="/f/xlogin/connect?redirectAfterAuth=/mypage"+t}},"handler")},"getOnClickXloginButtonHandler");t(({onClickXloginButtonHandler:t})=>{document.querySelectorAll('[data-id="xloginLoginBtn"]').forEach(e=>{e.onclick=t(e)})},"setOnClickXloginButton")({onClickXloginButtonHandler:e()})},"reloadXloginLoginBtn"),v=a,L=m,a={},m=(e(a,{input:()=>_,output:()=>j}),{}),k=(e(m,{getModalElmAndSetter:()=>T,postRequest:()=>k,setOnClickNavManu:()=>E,setOnClickNotification:()=>q,showGlobalNotification:()=>P,slideDown:()=>A,slideToggle:()=>M,slideUp:()=>O}),t((e,t={})=>{var o={method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},timeout:3e4};return t&&(o.body=JSON.stringify(t)),fetch(e,o).then(e=>!e.error&&e.body&&e.json?e.json():null).catch(e=>(console.error("[fatal] error @postRequest:",e),null))},"postRequest")),E=t(()=>{var e=document.querySelector("#commonNavToggle");const t=document.querySelector("#commonNavContent");e.onclick=()=>{0<=[...t.classList.values()].indexOf("hidden")?t.classList.remove("hidden"):t.classList.add("hidden")}},"setOnClickNavManu"),w=!1,P=t(async(e,t,i)=>{t=await t(e+"/notification/global/list");const r=document.querySelector("#notificationContainer"),n=(r.clearChildren(),document.querySelector("#notificationTemplate")),s=Object.values(t?.result?.globalNotificationList||{}).reverse();s.forEach((t,e)=>{const o=n.cloneNode(!0);o.classList.remove("hidden"),o.querySelector('[data-id="subject"]').innerText=t.subject,o.onclick=e=>{e.preventDefault(),e.stopPropagation();e=document.querySelector("#modalTemplate").cloneNode(!0);e.classList.remove("hidden"),e.querySelector('[data-id="modalTitle"]').innerText=t.subject,e.querySelector('[data-id="modalContent"]').appendChild(document.createTextNode(t.detail)),i(e)},setTimeout(()=>{o.style.transitionDuration="0.5s",o.style.opacity=0,r.appendChild(o),setTimeout(()=>{o.style.opacity=1},100)},.5*e*1e3),setTimeout(()=>{o.style.transitionDuration="0.2s",o.style.opacity=0},.5*s.length*1e3+3e3+.2*e*1e3)}),setTimeout(()=>{r.clearChildren(),w=!1},.7*s.length*1e3+3e3)},"showGlobalNotification"),q=t((t,e,o,i)=>{e('[data-id="notificationBtn"]',e=>{e.onclick=e=>{e.preventDefault(),e.stopPropagation(),w||(w=!0,P(t,o,i))}})},"setOnClickNotification"),T=t(()=>{var e=document.querySelector("#modalTemplate").cloneNode(!0);const o=e.querySelector('[data-id="modalTitle"]'),i=e.querySelector('[data-id="modalContent"]');return{modalElm:e,setContentElm:t((e,t)=>{o.innerText=e,i.clearChildren(),i.appendChild(t)},"setContentElm")}},"getModalElmAndSetter"),O=t((e,t=300)=>{e.style.height=e.offsetHeight+"px",null!==e.offsetHeight&&(e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.transitionTimingFunction="ease",e.style.overflow="hidden",e.style.height=0,e.style.paddingTop=0,e.style.paddingBottom=0,e.style.marginTop=0,e.style.marginBottom=0,setTimeout(()=>{e.style.display="none",e.style.removeProperty("height"),e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.style.removeProperty("transition-timing-function")},t))},"slideUp"),A=t((e,t=300)=>{e.style.removeProperty("display");let o=window.getComputedStyle(e)["display"];"none"===o&&(o="block"),e.style.display=o;var i=e.offsetHeight;e.style.overflow="hidden",e.style.height=0,e.style.paddingTop=0,e.style.paddingBottom=0,e.style.marginTop=0,e.style.marginBottom=0,null!==e.offsetHeight&&(e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.transitionTimingFunction="ease",e.style.height=i+"px",e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),setTimeout(()=>{e.style.removeProperty("height"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.style.removeProperty("transition-timing-function")},t))},"slideDown"),M=t((e,t=300,o=!1)=>{"none"===window.getComputedStyle(e).display?A(e,t):o||O(e,t)},"slideToggle"),B={},R=(e(B,{fetchSplitPermissionList:()=>D,getRequest:()=>R}),t((e,t={})=>{var o=t&&Object.keys(t).map(e=>e+"="+t[e]).join("&");return fetch(o?e+"?"+o:e,{method:"GET",credentials:"same-origin",timeout:3e4}).then(e=>!e.error&&e.body&&e.json?e.json():null).catch(e=>(console.error("[fatal] error @getRequest:",e),null))},"getRequest")),D=t(e=>{return R(e+"/session/splitPermissionList")},"fetchSplitPermissionList"),j=m,_=B,F=l,H=a,U=t(()=>{return(new Error).stack.replace(/^Error\n.*\n.*\n/,"")},"getCaller"),Y=t(()=>{void 0===Element.prototype.clearChildren&&Object.defineProperty(Element.prototype,"clearChildren",{configurable:!0,enumerable:!1,value(){for(;this.firstChild;)this.removeChild(this.lastChild)}}),void 0===window.argNamed&&(window.argNamed=e=>{const t={};return Object.keys(e).forEach(o=>{Array.isArray(e[o])?Object.assign(t,e[o].reduce((e,t)=>{if(void 0===t)throw new Error(`[error] flat argument by list can only contain function but: ${typeof t} @${o}
===== maybe you need make func exported like  module.exports = { func, } =====`);if("function"!=typeof t)throw new Error(`[error] flat argument by list can only contain function but: ${typeof t} @`+o);return e[t.name]=t,e},{})):"object"==typeof e[o]&&null!==e[o]?Object.assign(t,e[o]):t[o]=e[o]}),t})},"monkeyPatch"),V=t(e=>{e&&e.redirect&&(window.location.href=e.redirect)},"redirect"),N=t(e=>Array.prototype.map.call(new Uint8Array(e),e=>("00"+e.toString(16)).slice(-2)).join(""),"buf2Hex"),$=t((i,e)=>new Promise(t=>{const o=new TextEncoder("utf-8");window.crypto.subtle.importKey("raw",o.encode(e),{name:"HMAC",hash:{name:"SHA-512"}},!1,["sign","verify"]).then(e=>{window.crypto.subtle.sign("HMAC",e,o.encode(i)).then(e=>{e=new Uint8Array(e);t(N(e))})})}),"calcHmac512"),W=t(()=>window.crypto.getRandomValues(new Uint8Array(64)),"genSalt"),X=t((o,i)=>new Promise(t=>{var e=new Uint8Array(Array.prototype.map.call(o,e=>e.charCodeAt(0)));window.crypto.subtle.importKey("raw",e,{name:"PBKDF2"},!1,["deriveBits"]).then(e=>{return window.crypto.subtle.deriveBits({name:"PBKDF2",salt:i,iterations:1e6,hash:{name:"SHA-512"}},e,512).then(e=>{t(N(e))})})}),"calcPbkdf2"),m={},G=(e(m,{default:()=>K,fetchScope:()=>G}),t(({getRequest:e,apiEndpoint:t})=>{return e(t+"/confirm/scope/list")},"fetchScope")),K={},B={},J=(e(B,{default:()=>ee,getOnClickCheckAllScopeButton:()=>Q,getOnClickScopeDetailBtn:()=>Z,getOnClickShowOptionPermissionBtn:()=>z,getOnSubmitConfirm:()=>J}),t(({getPermissionCheckList:t,postConfirm:o,switchLoading:i,redirect:r,checkImportantPermissionWithModal:n,scopeExtraConfigList:s,labelList:l,showModal:a,getErrorModalElmAndSetter:c,resultCheckTrough:d})=>async()=>{i(!0);var e=t();await n({permissionList:e,resultCheckTrough:d,scopeExtraConfigList:s,labelList:l,showModal:a,getErrorModalElmAndSetter:c})?o({permissionList:e}).then(e=>{i(!1),r(e)}):i(!1)},"getOnSubmitConfirm")),Q=t(({getRequiredPermissionCheckElmList:e})=>()=>{setTimeout(()=>{e().forEach(e=>{e.checked=!0})},300)},"getOnClickCheckAllScopeButton"),z=t(({notRequiredPermissionListElm:e,flipSvgElm:t,slideToggle:o})=>()=>{o(e,300,!1),t.classList.contains("flipY")?t.classList.remove("flipY"):t.classList.add("flipY")},"getOnClickShowOptionPermissionBtn"),Z=t(({getModalElmAndSetter:e,showModal:o})=>{const{modalElm:i,setContentElm:r}=e();return(e,t)=>{r(e,t),o(i)}},"getOnClickScopeDetailBtn"),ee={},l={},x=(e(l,{checkImportantPermissionWithModal:()=>ie,checkThrough:()=>oe,convertPermissionList:()=>te}),t(({labelList:t,scope:e})=>{var o=e.split(":");if(o.length<2)throw new Error("invalid scope value: "+e);let i=null;e=[];if("*"===o[0][0]?(i=!0,o[0]=o[0].slice(1)):i=!1,0<=o[0].indexOf("r")&&e.push("read"),0<=o[0].indexOf("w")&&e.push("write"),0<=o[0].indexOf("a")&&e.push("append"),0===e.length)throw new Error("unknown mode: "+o[0]);"auth"!==o[1]&&(o[1]="service");var e=e.map(e=>t.scopeOperation.operation[e]).join("と"),{label:o,summary:r}=t.scopeBody[o[1]][o[2]],n=[],o=(n.push(o),i?n.push(`の${e} (${t.scopeOperation.prefix.isRequired})`):n.push("の"+e),n.join(""));return{labelNoWrapList:n,label:o,summary:r,isRequired:i}},"_convertScopeToLabel")),te=t(({labelList:t,resultFetchScope:e})=>{if(!e||!e.result||!e.result.scope)throw new Error("invalid scope value: "+JSON.stringify(e));const o={};e=e.result.scope.split(",");return 0!==e.length&&e.forEach(e=>{o[e]=x({scope:e,labelList:t})}),o},"convertPermissionList"),oe=t(({postThrough:e,notRequiredPermissionListElm:o,flipSvgElm:i,updateRequestScope:r,updateScopeAlreadyChecked:n,switchLoading:s,redirect:l,slideToggle:a})=>(s(!0),e().then(e=>{s(!1),l(e),r({requestScope:e?.result?.requestScope,notRequiredPermissionListElm:o,flipSvgElm:i,slideToggle:a});var t=e?.result?.oldPermissionList||{};return n({oldPermissionList:t}),e})),"checkThrough"),ie=t(async({permissionList:e,resultCheckTrough:t,scopeExtraConfigList:o,labelList:i,showModal:r,getErrorModalElmAndSetter:n})=>{var s,l,{modalElm:a,setContent:c}=n(),d=t?.result?.oldPermissionList||{};for await([s,l]of Object.entries(e))if(l&&!d[s]){var m=s.split(":").slice(1).join(":");if(o[m]&&o[m].dialogConfirm){m=x({labelList:i,scope:s})["label"],m=(c(`[${m}(${s})]は重要な権限です。本当に許可しますか？`,null,"確認"),await r(a,!0));if(!m)return!1}}return!0},"checkImportantPermissionWithModal"),a={},re=(e(a,{getAccordionElm:()=>he,getConfirmFormElm:()=>ce,getPermissionCheckList:()=>le,getPostConfirm:()=>ae,getPostThrough:()=>me,getRequiredPermissionCheckElmList:()=>ue,setConfirmFormSubmit:()=>de,setOnCheckAllScopeButton:()=>pe,setOnClickShowOptionPermissionBtn:()=>ge,showPermissionLabelList:()=>re,updateRequestScope:()=>ne,updateScopeAlreadyChecked:()=>se}),t(({permissionLabelList:e,getRandomStr:a,scopeExtraConfigList:c,onClickScopeDetailBtn:d})=>{const m=document.querySelector("#requiredPermissionList"),u=document.querySelector("#notRequiredPermissionList"),p=document.querySelector("#permissionCheckDetailButtonTemplate");Object.entries(e).forEach(([e,o])=>{var t="permissionCheck_"+a(16),i="wrap_"+t;const r=e.split(":").slice(1).join(":");var n=c[r];let s=null;(s=(n&&n.templateId?document.querySelector(n.templateId):document.querySelector("#permissionCheckTemplate")).cloneNode(!0)).classList.remove("hidden"),s.setAttribute("id",i);n=s.querySelector('[data-id="permissionCheckTemplateInput"]');n.setAttribute("data-scope",e),n.setAttribute("id",t),n.setAttribute("data-scope-is-required",o.isRequired),o.isRequired&&n.setAttribute("required",!0);const l=s.querySelector('[data-id="permissionCheckTemplateInputLabel"]');l.setAttribute("for",t),o.labelNoWrapList.forEach(e=>{var t=document.createElement("span");t.classList.add("whitespace-nowrap"),t.innerText=e,l.appendChild(t)}),s.querySelector('[data-id="permissionCheckTemplateDetailBtn"]').onclick=e=>{e.preventDefault();var e=document.createElement("div"),t=(e.appendChild(document.createTextNode(o.summary)),p.cloneNode(!0));t.setAttribute("href","/scopeDetail#"+r),t.classList.remove("hidden"),e.appendChild(t),d("権限の説明",e)},o.isRequired?m.insertBefore(s,m.children[m.children.length-1]):u.insertBefore(s,u.children[u.children.length-1])})},"showPermissionLabelList")),ne=t(({requestScope:e,notRequiredPermissionListElm:t,flipSvgElm:o,slideToggle:i})=>{e=document.querySelector(`[data-scope="${e}"]`);e&&(e.parentNode.classList.add("bg-red-400"),i(t,300,!0),o.classList.contains("flipY")||o.classList.add("flipY"))},"updateRequestScope"),se=t(({oldPermissionList:o})=>{Object.values(document.querySelectorAll("[data-scope]")).forEach(e=>{let t=e.dataset["scope"];0<t.length&&"*"===t[0]&&(t=t.slice(1)),o[t]&&(e.checked=!0)})},"updateScopeAlreadyChecked"),le=t(()=>{const o={};return Object.values(document.querySelectorAll("[data-scope]")).forEach(e=>{let t=e.dataset["scope"];0<t.length&&"*"===t[0]&&(t=t.slice(1)),o[t]=e.checked}),o},"getPermissionCheckList"),ae=t(({apiEndpoint:e,postRequest:t})=>{const o=e+"/confirm/permission/check";return({permissionList:e})=>{e={permissionList:e};return t(o,e)}},"getPostConfirm"),ce=t(()=>{return document.querySelector("#confirmForm")},"getConfirmFormElm"),de=t(({confirmFormElm:e,onSubmitConfirm:t})=>{e.onsubmit=e=>{e.preventDefault(),e.stopPropagation(),t()}},"setConfirmFormSubmit"),me=t(({apiEndpoint:e,postRequest:t})=>{const o=e+"/confirm/through/check";return()=>{return t(o,{})}},"getPostThrough"),ue=t(()=>{return Object.values(document.querySelectorAll('[data-scope-is-required="true"]'))},"getRequiredPermissionCheckElmList"),pe=t(({onClickCheckAllScopeButton:e})=>{document.querySelector("#checkAllScopeBtn").onclick=e},"setOnCheckAllScopeButton"),he=t(()=>{return{notRequiredPermissionListElm:document.querySelector("#notRequiredPermissionList"),flipSvgElm:document.querySelector("#showOptionPermissionBtn svg"),showOptionPermissionBtnElm:document.querySelector("#showOptionPermissionBtn")}},"getAccordionElm"),ge=t(({showOptionPermissionBtnElm:e,onClickShowOptionPermissionBtn:t,notRequiredPermissionListElm:o})=>{e.onclick=t,o.onclick=e=>{e.stopPropagation()}},"setOnClickShowOptionPermissionBtn"),e={},I=(e.setting=o,e.lib=s,e.input=m,e.action=B,e.core=l,e.output=a,e),o=t(async()=>{var e=await I.input.fetchScope(argNamed({setting:I.setting.browserServerSetting.getList("apiEndpoint"),lib:[I.lib.common.input.getRequest]})),e=I.core.convertPermissionList(argNamed({setting:I.setting.browserServerSetting.getList("labelList"),other:{resultFetchScope:e}})),t=I.action.getOnClickScopeDetailBtn(argNamed({lib:[I.lib.xdevkit.output.showModal,I.lib.common.output.getModalElmAndSetter]}));I.output.showPermissionLabelList(argNamed({setting:I.setting.getList("scopeExtraConfigList"),setting2:I.setting.browserServerSetting.getList("labelList"),lib:[I.lib.xdevkit.lib.getRandomStr],other:{permissionLabelList:e,onClickScopeDetailBtn:t}}))},"loadAllPermissionList"),s=t(({resultCheckTrough:e})=>{var t=I.output.getPostConfirm(argNamed({lib:[I.lib.common.output.postRequest],setting:I.setting.browserServerSetting.getList("apiEndpoint")})),t=I.action.getOnSubmitConfirm(argNamed({output:[I.output.getPermissionCheckList],core:[I.core.checkImportantPermissionWithModal],setting:I.setting.getList("scopeExtraConfigList"),setting2:I.setting.browserServerSetting.getList("labelList"),lib:[I.lib.xdevkit.output.switchLoading,I.lib.redirect,I.lib.xdevkit.output.showModal,I.lib.xdevkit.output.getErrorModalElmAndSetter],other:{postConfirm:t,resultCheckTrough:e}})),e=I.output.getConfirmFormElm();I.output.setConfirmFormSubmit(argNamed({elm:{confirmFormElm:e},onSubmit:{onSubmitConfirm:t}}))},"loadConfirmForm"),m=t(()=>{var e=I.action.getOnClickCheckAllScopeButton(argNamed({output:[I.output.getRequiredPermissionCheckElmList]}));I.output.setOnCheckAllScopeButton(argNamed({onClick:{onClickCheckAllScopeButton:e}}))},"loadCheckAllScopeButton"),B=t(async()=>{var e=I.output.getPostThrough(argNamed({lib:[I.lib.common.output.postRequest],setting:I.setting.browserServerSetting.getList("apiEndpoint")})),{notRequiredPermissionListElm:t,flipSvgElm:o}=I.output.getAccordionElm();return I.core.checkThrough(argNamed({param:{postThrough:e,notRequiredPermissionListElm:t,flipSvgElm:o},output:[I.output.updateRequestScope,I.output.updateScopeAlreadyChecked],lib:[I.lib.xdevkit.output.switchLoading,I.lib.redirect,I.lib.common.output.slideToggle]}))},"startThroughCheck"),l=t(async()=>{var{notRequiredPermissionListElm:e,flipSvgElm:t,showOptionPermissionBtnElm:o}=I.output.getAccordionElm(),t=I.action.getOnClickShowOptionPermissionBtn(argNamed({elm:{notRequiredPermissionListElm:e,flipSvgElm:t},lib:[I.lib.common.output.slideToggle]}));I.output.setOnClickShowOptionPermissionBtn(argNamed({elm:{notRequiredPermissionListElm:e,showOptionPermissionBtnElm:o},onClick:{onClickShowOptionPermissionBtn:t}}))},"loadNotRequiredPermissionListAccordion"),a=t(async()=>{I.lib.xdevkit.output.switchLoading(!0),I.lib.common.output.setOnClickNavManu(),I.lib.common.output.setOnClickNotification(I.setting.browserServerSetting.getValue("apiEndpoint"),I.lib.xdevkit.output.applyElmList,I.lib.common.input.getRequest,I.lib.xdevkit.output.showModal),I.lib.monkeyPatch(),await I.app.loadAllPermissionList(),I.app.loadCheckAllScopeButton(),await I.app.loadNotRequiredPermissionListAccordion();var e=await I.app.startThroughCheck();I.app.loadConfirmForm({resultCheckTrough:e})},"main");I.app={main:a,loadAllPermissionList:o,loadConfirmForm:s,loadCheckAllScopeButton:m,loadNotRequiredPermissionListAccordion:l,startThroughCheck:B},I.app.main()})();