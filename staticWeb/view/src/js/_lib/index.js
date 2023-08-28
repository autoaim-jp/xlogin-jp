/* /_lib/index.js */
import * as xdevkitMod from './_xdevkit/index.js'
import * as commonMod from './_common/index.js'

export const xdevkit = xdevkitMod
export const common = commonMod

/* debug */
export const getCaller = () => {
  const callerInfo = new Error().stack.replace(/^Error\n.*\n.*\n/, '')
  return callerInfo
}

/* asocial */
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

export const redirect = (response) => {
  if (response && response.redirect) {
    window.location.href = response.redirect
  }
}

/* crypto */
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

