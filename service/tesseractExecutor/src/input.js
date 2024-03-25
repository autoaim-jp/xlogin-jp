const mod = {}

const init = ({ fs }) => {
  mod.fs = fs
}

const readFileContent = ({ filePath }) => {
  return mod.fs.readFileSync(filePath, 'utf-8')
}

export default {
  init,
  readFileContent,
}

