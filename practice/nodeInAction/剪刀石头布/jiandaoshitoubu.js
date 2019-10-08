const game = require('./lib')

// let playerAction = process.argv[process.argv.length - 1]

let count = 0

process.stdin.on('data', e => {
  const playerAction = e.toString().trim()
  const result = game(playerAction)
  if (result === 1) {
    count++
  }
  if (count == 3) {
    console.log('电脑：丢你太厉害了，我不玩了')
    process.exit()
  }
})
