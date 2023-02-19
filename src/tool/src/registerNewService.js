import readline from 'readline'
import { Writable } from 'stream'
import fs from 'fs'

import setting from '../../setting/index.js'

const mutableStdout = new Writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding)
    }
    callback()
  }
})

const inputLine = (label, isInvisible) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: mutableStdout,
      terminal: true
    })

    process.stdout.write(label)
    if(isInvisible) {
      mutableStdout.muted = true
    }
    rl.question(label, (line) => {
      if(isInvisible) {
        process.stdout.write('\n')
        mutableStdout.muted = false
      }
      rl.close()
      resolve(line)
    })
  })
}


const main = async () => {
  const serviceName = await inputLine('Service name: ', false)
  const clientId = await inputLine('clientId(Open ID Connect): ', false)
  const redirectUri = await inputLine('redirectUri(Open ID Connect): ', false)

  const clientList = JSON.parse(fs.readFileSync(setting.server.CLIENT_LIST_JSON))
  if (clientList[clientId]) {
    console.log('client already exists:', { clientId, client: clientList[clientId] })
    process.exit(1)
  }
  clientList[clientId] = {
    serviceName,
    redirectUri,
  }

  fs.writeFileSync(setting.server.CLIENT_LIST_JSON, JSON.stringify(clientList, null, 2))
  console.log('saved client in:', setting.server.CLIENT_LIST_JSON)
  console.log('done.')
}

main()

