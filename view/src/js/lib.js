/* lib.js */
/* debug */
export const getCaller = () => {
  const callerInfo = new Error().stack.replace(/^Error\n.*\n.*\n/, '')
  return callerInfo
}

/* request */
export const getRequest = (_url, param = {}) => {
  const query = param && Object.keys(param).map((key) => { return `${key}=${param[key]}` }).join('&')
  const url = query ? `${_url}?${query}` : _url
  const opt = {
    method: 'GET',
    credentials: 'same-origin',
    timeout: 30 * 1000,
  }
  return fetch(url, opt).then((res) => {
    if (res.error || !res.body || !res.json) {
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
  if (param) {
    opt.body = JSON.stringify(param)
  }
  return fetch(url, opt).then((res) => {
    if (res.error || !res.body || !res.json) {
      return null
    }
    return res.json()
  }).catch((e) => {
    console.error('[fatal] error @postRequest:', e)
    return null
  })
}

/* element */
const applyElmList = (query, f, parent = document) => {
  Object.values(parent.querySelectorAll(query)).forEach((elm) => {
    f(elm)
  })
}

const closeModal = () => {
  applyElmList('[data-id="modal"], #modalBackground', (elm) => {
    elm.classList.add('hidden')
  })
}

export const showModal = (modalElm, cancelButtonIsVisible = false, onConfirm = () => {}) => {
  if (modalElm.id === 'modalTemplate') {
    modalElm.id = ''
  }
  document.body.appendChild(modalElm)
  closeModal()

  setTimeout(() => {
    applyElmList('[data-id="modalClose"], [data-id="modalCancelButton"]', (elm) => {
      elm.onclick = closeModal
    }, document)

    if (cancelButtonIsVisible) {
      modalElm.querySelector('[data-id="modalCancelButton"]').classList.remove('hidden')
    } else {
      modalElm.querySelector('[data-id="modalCancelButton"]').classList.add('hidden')
    }
    modalElm.querySelector('[data-id="modalConfirmButton"]').onclick = () => {
      if (typeof onConfirm === 'function') {
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

export const getErrorModalElmAndSetter = () => {
  const modalTemplateElm = document.querySelector('#modalTemplate')
  const modalElm = modalTemplateElm.cloneNode(true)

  modalElm.querySelector('[data-id="modalTitle"]').innerText = 'エラー'

  const labelP = document.createElement('p')
  labelP.innerText = 'エラーが発生しました。'
  modalElm.querySelector('[data-id="modalContent"]').appendChild(labelP)

  const setContent = (textStr, errorLabelList) => {
    labelP.innerText = errorLabelList[textStr] || textStr
  }

  return { modalElm, setContent }
}

export const switchLoading = (isVisible) => {
  const loadingElm = document.querySelector('#loading')
  if (!loadingElm) {
    return
  }

  if (isVisible) {
    loadingElm.classList.remove('hidden')
  } else {
    loadingElm.classList.add('hidden')
  }
}

/* nav */
export const setOnClickNavManu = () => {
  const toggleElm = document.querySelector('#commonNavToggle')
  const navContentElm = document.querySelector('#commonNavContent')
  toggleElm.onclick = () => {
    if ([...navContentElm.classList.values()].indexOf('hidden') >= 0) {
      navContentElm.classList.remove('hidden')
    } else {
      navContentElm.classList.add('hidden')
    }
  }
}

/* notification */
let notificationIsVisible = false
export const showGlobalNotification = async (apiEndpoint) => {
  const durationShow = 0.5
  const durationHide = 0.2
  const resultFetchGlobalNotification = await getRequest(`${apiEndpoint}/notification/global/list`)

  const notificationContainerElm = document.querySelector('#notificationContainer')
  notificationContainerElm.clearChildren()
  const notificationTemplateElm = document.querySelector('#notificationTemplate')
  const notificationList = Object.values(resultFetchGlobalNotification?.result?.globalNotificationList || {}).reverse()
  notificationList.forEach((row, i) => {
    const notificationElm = notificationTemplateElm.cloneNode(true)
    notificationElm.classList.remove('hidden')
    notificationElm.querySelector('[data-id="subject"]').innerText = row.subject
    notificationElm.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const modalTemplateElm = document.querySelector('#modalTemplate')
      const modalElm = modalTemplateElm.cloneNode(true)
      modalElm.classList.remove('hidden')
      modalElm.querySelector('[data-id="modalTitle"]').innerText = row.subject
      modalElm.querySelector('[data-id="modalContent"]').appendChild(document.createTextNode(row.detail))
      showModal(modalElm)
    }
    setTimeout(() => {
      notificationElm.style.transitionDuration = `${durationShow}s`
      notificationElm.style.opacity = 0
      notificationContainerElm.appendChild(notificationElm)
      setTimeout(() => {
        notificationElm.style.opacity = 1
      }, 100)
    }, durationShow * i * 1000)
    setTimeout(() => {
      notificationElm.style.transitionDuration = `${durationHide}s`
      notificationElm.style.opacity = 0
    }, durationShow * notificationList.length * 1000 + 3 * 1000 + durationHide * i * 1000)
  })

  setTimeout(() => {
    notificationContainerElm.clearChildren()
    notificationIsVisible = false
  }, (durationShow + durationHide) * notificationList.length * 1000 + 3 * 1000)
}

export const setOnClickNotification = (apiEndpoint) => {
  applyElmList('[data-id="notificationBtn"]', (notificationBtn) => {
    notificationBtn.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (notificationIsVisible) {
        return
      }
      notificationIsVisible = true
      showGlobalNotification(apiEndpoint)
    }
  })
}

/* misc */
export const monkeyPatch = () => {
  if (typeof Element.prototype.clearChildren === 'undefined') {
    Object.defineProperty(Element.prototype, 'clearChildren', {
      configurable: true,
      enumerable: false,
      value() {
        while (this.firstChild) {
          this.removeChild(this.lastChild)
        }
      },
    })
  }

  if (typeof window.argNamed === 'undefined') {
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
        if (Array.isArray(obj[key])) {
          Object.assign(flattened, obj[key].reduce((prev, curr) => {
            if (typeof curr === 'undefined') {
              throw new Error(`[error] flat argument by list can only contain function but: ${typeof curr} @${key}\n===== maybe you need make func exported like  module.exports = { func, } =====`)
            } else if (typeof curr === 'function') {
              prev[curr.name] = curr
            } else {
              throw new Error(`[error] flat argument by list can only contain function but: ${typeof curr} @${key}`)
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

/* crypto */
export const getRandomStr = (len) => {
  return btoa(crypto.getRandomValues(new Uint8Array(len))).slice(0, len)
}

export const buf2Hex = (buf) => {
  return Array.prototype.map.call(new Uint8Array(buf), (x) => { return (`00${x.toString(16)}`).slice(-2) }).join('')
}

export const calcHmac512 = (data, secret) => {
  return new Promise((resolve) => {
    const enc = new TextEncoder('utf-8')
    window.crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      {
        name: 'HMAC',
        hash: { name: 'SHA-512' },
      },
      false,
      ['sign', 'verify'],
    ).then((key) => {
      window.crypto.subtle.sign(
        'HMAC',
        key,
        enc.encode(data),
      ).then((hash) => {
        const buf = new Uint8Array(hash)
        resolve(buf2Hex(buf))
      })
    })
  })
}

export const genSalt = () => {
  return window.crypto.getRandomValues(new Uint8Array(64))
}

export const calcPbkdf2 = (str, salt) => {
  return new Promise((resolve) => {
    const byteList = new Uint8Array(Array.prototype.map.call(str, (c) => {
      return c.charCodeAt(0)
    }))
    window.crypto.subtle.importKey('raw', byteList, { name: 'PBKDF2' }, false, ['deriveBits'])
      .then((key) => {
        const opt = {
          name: 'PBKDF2',
          salt,
          iterations: 1000 * 1000,
          hash: { name: 'SHA-512' },
        }
        return window.crypto.subtle.deriveBits(opt, key, 512).then((buf) => {
          resolve(buf2Hex(buf))
        })
      })
  })
}

/* url */
export const redirect = (response) => {
  if (response && response.redirect) {
    window.location.href = response.redirect
  }
}

export const getSearchQuery = () => {
  const searchQuery = {}
  window.location.search.replace(/^\?/, '').split('&').forEach((row) => {
    const kv = row.split('=')
    const [key, value] = kv
    searchQuery[key] = value
  })
  return searchQuery
}

/* animation */
export const slideUp = (elm, duration = 300) => {
  elm.style.height = `${elm.offsetHeight}px`
  if (elm.offsetHeight === null) {
    /* dummy */
    return
  }
  elm.style.transitionProperty = 'height, margin, padding'
  elm.style.transitionDuration = `${duration}ms`
  elm.style.transitionTimingFunction = 'ease'
  elm.style.overflow = 'hidden'
  elm.style.height = 0
  elm.style.paddingTop = 0
  elm.style.paddingBottom = 0
  elm.style.marginTop = 0
  elm.style.marginBottom = 0
  setTimeout(() => {
    elm.style.display = 'none'
    elm.style.removeProperty('height')
    elm.style.removeProperty('padding-top')
    elm.style.removeProperty('padding-bottom')
    elm.style.removeProperty('margin-top')
    elm.style.removeProperty('margin-bottom')
    elm.style.removeProperty('overflow')
    elm.style.removeProperty('transition-duration')
    elm.style.removeProperty('transition-property')
    elm.style.removeProperty('transition-timing-function')
  }, duration)
}

export const slideDown = (elm, duration = 300) => {
  elm.style.removeProperty('display')
  let { display } = window.getComputedStyle(elm)
  if (display === 'none') {
    display = 'block'
  }
  elm.style.display = display
  const height = elm.offsetHeight
  elm.style.overflow = 'hidden'
  elm.style.height = 0
  elm.style.paddingTop = 0
  elm.style.paddingBottom = 0
  elm.style.marginTop = 0
  elm.style.marginBottom = 0
  if (elm.offsetHeight === null) {
    /* dummy */
    return
  }
  elm.style.transitionProperty = 'height, margin, padding'
  elm.style.transitionDuration = `${duration}ms`
  elm.style.transitionTimingFunction = 'ease'
  elm.style.height = `${height}px`
  elm.style.removeProperty('padding-top')
  elm.style.removeProperty('padding-bottom')
  elm.style.removeProperty('margin-top')
  elm.style.removeProperty('margin-bottom')
  setTimeout(() => {
    elm.style.removeProperty('height')
    elm.style.removeProperty('overflow')
    elm.style.removeProperty('transition-duration')
    elm.style.removeProperty('transition-property')
    elm.style.removeProperty('transition-timing-function')
  }, duration)
}

export const slideToggle = (elm, duration = 300, ignoreIfOpen = false) => {
  if (window.getComputedStyle(elm).display === 'none') {
    slideDown(elm, duration)
  } else if (!ignoreIfOpen) {
    slideUp(elm, duration)
  }
}

