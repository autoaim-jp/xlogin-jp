/* index/app.js */
const asocial = {}

import * as lib from '../lib.js'
asocial.lib = lib
/* a is an alias of asocial */
const a = asocial

const main = async () => {
  a.lib.switchLoading(true)
  a.lib.setOnClickNavManu()
  a.lib.monkeyPatch()
  setTimeout(() => {
    a.lib.switchLoading(false)
  }, 300)
}

a.app = {
  main,
}

a.app.main()

