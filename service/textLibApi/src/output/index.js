import backendServerOutput from './backendServerOutput.js'

/**
 * init.
 *
 * @param {} setting
 * @return {undefined} 戻り値なし
 * @memberof input
 */
const init = ({ setting }) => {
  backendServerOutput.init({ setting })
}


export default {
  backendServerOutput,

  init,
}

