const assert = require('assert')
const monkey = require('../../')

const client = monkey.connect({ port: 1080 })

client.type('hello monkey!', function(err) {
  assert.ifError(err)
  console.log('Said hello to monkey')
  client.end()
})
