/* /lib/index.js */
import backendServerLib from './backendServerLib.js'

const mod = {}

const init = ({ winston }) => {
  backendServerLib.init({ winston })
}

export default {
  backendServerLib,

  init,
}

