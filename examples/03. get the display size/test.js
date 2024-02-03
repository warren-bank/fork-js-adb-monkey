const assert = require('assert')
const monkey = require('../../')

const client = monkey.connect({ port: 1080 })

client.getDisplayWidth(function(err, width) {
  assert.ifError(err)
  client.getDisplayHeight(function(err, height) {
    assert.ifError(err)
    console.log('Display size is %dx%d', width, height)
    client.end()
  })
})
