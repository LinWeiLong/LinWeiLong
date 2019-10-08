
const Geektime = require('./lib')

const geektime = new Geektime()


geektime.addListener('newlesson', (res) => {
  if (res.price < 80) {
    console.log('yeah! new lesson 比80块便宜', res.price)
  }
})
