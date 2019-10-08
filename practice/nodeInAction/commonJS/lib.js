console.log('Hello I\'m lib')

// exports 是module.exports 的引用
exports.hello = 'NodeJS'

module.exports = function rewriteExports(a, b) {
  return a+b
 }
setTimeout(() => {
  console.log(exports)
}, 500)
