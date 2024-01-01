import backendServerInput from './backendServerInput.js'

/**
 * init.
 *
 * @param {} setting
 * @param {} fs
 * @return {undefined} 戻り値なし
 * @memberof input
 */
const init = ({ setting, fs }) => {
  backendServerInput.init({ setting, fs })
}


export default {
  backendServerInput,
  init,
}

