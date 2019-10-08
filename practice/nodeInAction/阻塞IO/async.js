
const glob = require('glob')

let result = null
console.time('glob')
result = glob.sync(__dirname + '/**/*')

glob(__dirname + '/**/*', function (err, res) {
  result = res
console.log('glob result')

})
console.timeEnd('glob')

console.log(1+1)
