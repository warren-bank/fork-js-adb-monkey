const assert = require('assert')
const monkey = require('../../')

const client = monkey.connect({ port: 1080 })

client.press(3 /* KEYCODE_HOME */, function(err) {
  assert.ifError(err)
  console.log('Pressed home button')
  client.end()
})
