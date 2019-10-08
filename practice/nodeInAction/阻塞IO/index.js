const glob = require('glob')

let result = null
console.time('glob')
result = glob.sync(__dirname + '/**/*')
console.timeEnd('glob')
console.log(result)
