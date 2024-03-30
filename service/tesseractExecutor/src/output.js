const mod = {}

const init = ({ fs }) => {
  mod.fs = fs
}

const makeDir = ({ dirPath }) => {
  mod.fs.mkdirSync(dirPath, { recursive: true })
}

const writeFileBase64 = ({ filePath, content }) => {
  return mod.fs.writeFileSync(filePath, content, { encoding: 'base64' })
}

export default {
  init,
  makeDir,
  writeFileBase64,
}

