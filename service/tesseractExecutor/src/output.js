const mod = {}

const init = ({ fs }) => {
  mod.fs = fs
}

const writeFileContent = ({ filePath, content }) => {
  return mod.fs.writeFileSync(filePath, content, { encoding: 'base64' })
}

export default {
  init,
  writeFileContent,
}

