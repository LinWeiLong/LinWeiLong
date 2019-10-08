module.exports = function (playerAction) {
  let  random = Math.random() * 3
  let computerAction

  if (random < 1) {
    computerAction = 'rock'
  } else if (random > 2) {
    computerAction = 'scissor'
  } else {
    computerAction = 'paper'
  }
  console.log('你的：' + playerAction + ' VS ' + '电脑：'+ computerAction)
  if (playerAction === computerAction) {
    console.log('平局')
    return 0
  } else if (
    (playerAction === 'rock' && computerAction === 'paper') ||
    (playerAction === 'scissor' && computerAction === 'rock') ||
    (playerAction === 'paper' && computerAction === 'scissor')
  ) {
    console.log('你输了')
    return 2
  } else {
    console.log('你赢了')
    return 1
  }
}
