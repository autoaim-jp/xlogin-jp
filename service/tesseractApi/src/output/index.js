import backendServerOutput from './backendServerOutput.js'

const mod = {}
/**
 * init.
 *
 * @param {} setting
 * @return {undefined} 戻り値なし
 * @memberof input
 */
const init = ({ setting, fs }) => {
  mod.fs = fs

  backendServerOutput.init({ setting })
}

const writeFile = ({ filePath, buff }) => {
  mod.fs.writeFileSync(filePath, buff)
}

const createUploadDir = ({ uploadDirDiskPath }) => {
  mod.fs.mkdirSync(uploadDirDiskPath, { recursive: true })
}

export default {
  backendServerOutput,

  init,

  writeFile,
  createUploadDir,
}

