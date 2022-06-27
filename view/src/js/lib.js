/* /lib.js */
/* debug */
export const getCaller = (stackIndex) => {
  const callerInfo = new Error().stack.replace(/^Error\n.*\n.*\n/, '')
  return callerInfo
}

export const log = (...message) => {
  console.log('[info]', ...message)
}
export const debug = (...message) => {
  console.log('==============================')
  console.log('[debug]', ...message)
  console.log('Called:')
  console.log(getCaller())
  console.log('==============================')
}

/* element */
const closeModal = () => {
  applyElmList('[data-id="modal"], #modalBackground', (elm) => {
    elm.classList.add('hidden')
  })
}
const applyElmList = (query, f, parent = document) => {
  Object.values(parent.querySelectorAll(query)).forEach((elm) => {
    f(elm)
  })
}
export const showModal = (modalElm, cancelButtonIsVisible = false, onConfirm = () => {}) => {
  document.body.appendChild(modalElm)
  closeModal()

  setTimeout(() => {
    applyElmList('[data-id="modalClose"], [data-id="modalCancelButton"]', (elm) => {
      elm.onclick = closeModal
    }, document)

    if(cancelButtonIsVisible) {
      modalElm.querySelector('[data-id="modalCancelButton"]').classList.remove('hidden')
    } else {
      modalElm.querySelector('[data-id="modalCancelButton"]').classList.add('hidden')
    }
    modalElm.querySelector('[data-id="modalConfirmButton"]').onclick = () => {
      if(typeof onConfirm === 'function') {
        onConfirm()
      }
      closeModal()
    }
    modalElm.classList.remove('hidden')
    document.querySelector('#modalBackground').classList.remove('hidden')
    modalElm.querySelector('[data-id="modalContent"]').scrollTop = 0
    modalElm.querySelector('[data-id="modalCard"]').onclick = (e) => {
      e.stopPropagation()
    }
    modalElm.onclick = (e) => {
      e.stopPropagation()
      closeModal()
    }
  }, 100)
}

export const switchLoading = (isVisible) => {
  const loadingElm = document.querySelector('#loading')
  if(!loadingElm) {
    return
  }

  if(isVisible) {
    loadingElm.classList.remove('hidden')
  } else {
    loadingElm.classList.add('hidden')
  }
}

export const setOnClickNavManu = () => {
  const toggleElm = document.querySelector('#commonNavToggle')
  const navContentElm = document.querySelector('#commonNavContent')
  toggleElm.onclick = () => {
    if([...navContentElm.classList.values()].indexOf('hidden') >= 0) {
      navContentElm.classList.remove('hidden')
    } else {
      navContentElm.classList.add('hidden')
    }
  }
}

/* request */
export const getRequest = (_url, param = {}) => {
  const query = param && Object.keys(param).map((key) => { return key + '=' + param[key] }).join('&')
  const url = query? _url + '?' + query: _url
  const opt = { 
    method: 'GET',
    credentials: 'same-origin',
    timeout: 30 * 1000,
  }
  return fetch(url, opt).then((res) => {
    if(res.error || !res.body || !res.json) {
      return null
    }
    return res.json()
  }).catch((e) => {
    console.error('[fatal] error @getRequest:', e)
    return null
  })
}

export const postRequest = (url, param = {}) => {
  const opt = { 
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30 * 1000,
  }
  if(param) {
    opt.body = JSON.stringify(param)
  }
  return fetch(url, opt).then((res) => {
    if(res.error || !res.body || !res.json) {
      return null
    }
    return res.json()
  }).catch((e) => {
    console.error('[fatal] error @postRequest:', e)
    return null
  })
}

/* misc */
export const monkeyPatch = () => {
  if(typeof Element.prototype.clearChildren === 'undefined') {
    Object.defineProperty(Element.prototype, 'clearChildren', {
      configurable: true,
      enumerable: false,
      value: function() {
        while(this.firstChild) {
          this.removeChild(this.lastChild)
        }
      }
    })
  }

  if(typeof window.argNamed === 'undefined') {
    /*
     * asocialの考え方ではどうしても引数が多くなる。
     * そのため、action, core, modなどのパーツのオブジェクトに分けて引数を渡す。
     * argNamedはその入れ子のArray, Objectをflatにする。
     * Arrayの中に含められるのは関数だけ。関数以外はObjで渡す。
     * { a: { param, obj, string, }, b: [ func, ], c: {}, } => { param, obj, string, func, }
     */
    window.argNamed = (obj) => {
      const flattened = {}

      Object.keys(obj).forEach((key) => {
        if(Array.isArray(obj[key])) {
          Object.assign(flattened, obj[key].reduce((prev, curr) => {
            if(typeof curr === 'undefined') {
              throw new Error('[error] flat argument by list can only contain function but: ' + (typeof curr) + ' @' + key + '\n===== maybe you need make func exported like  module.exports = { func, } =====')
            } else if(typeof curr === 'function') {
              prev[curr.name] = curr
            } else {
              throw new Error('[error] flat argument by list can only contain function but: ' + (typeof curr) + ' @' + key)
            }
            return prev
          }, {}))
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          Object.assign(flattened, obj[key])
        } else {
          flattened[key] = obj[key]
        }
      })

      return flattened
    }
  }
}
export const getRandomStr = (len) => {
  return btoa(crypto.getRandomValues(new Uint8Array(len))).slice(0, len)
}

