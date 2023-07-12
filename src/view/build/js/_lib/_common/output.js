/* /_common/output.js */

/* request */
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
export const showGlobalNotification = async (apiEndpoint, getRequest) => {
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

export const setOnClickNotification = (apiEndpoint, applyElmList, getRequest) => {
  applyElmList('[data-id="notificationBtn"]', (notificationBtn) => {
    notificationBtn.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (notificationIsVisible) {
        return
      }
      notificationIsVisible = true
      showGlobalNotification(apiEndpoint, getRequest)
    }
  })
}


/* modal */
export const getModalElmAndSetter = () => {
  const modalTemplateElm = document.querySelector('#modalTemplate')
  const modalElm = modalTemplateElm.cloneNode(true)

  const modalTitleElm = modalElm.querySelector('[data-id="modalTitle"]')
  const modalContentElm = modalElm.querySelector('[data-id="modalContent"]')

  const setContentElm = (title, contentElm) => {
    modalTitleElm.innerText = title
    modalContentElm.clearChildren()
    modalContentElm.appendChild(contentElm)
  }

  return { modalElm, setContentElm }
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

