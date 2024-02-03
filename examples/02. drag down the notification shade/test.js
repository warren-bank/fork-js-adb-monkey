const assert = require('assert')
const monkey = require('../../')

const client = monkey.connect({ port: 1080 })

client.multi()
  .touchDown(100, 0)
  .sleep(5)
  .touchMove(100, 20)
  .sleep(5)
  .touchMove(100, 40)
  .sleep(5)
  .touchMove(100, 60)
  .sleep(5)
  .touchMove(100, 80)
  .sleep(5)
  .touchMove(100, 100)
  .sleep(5)
  .touchUp(100, 100)
  .sleep(5)
  .execute(function(err) {
    assert.ifError(err)
    console.log('Dragged out the notification bar')
    client.end()
  })
