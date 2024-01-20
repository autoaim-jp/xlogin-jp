/* /lib/index.js */
import backendServerLib from './backendServerLib.js'

const init = ({ winston }) => {
  backendServerLib.init({ winston })
}

export default {
  backendServerLib,

  init,
}

