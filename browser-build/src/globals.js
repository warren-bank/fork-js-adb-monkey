const Net = require('net')

Net.Socket.prototype.encoding   = 'binary'
Net.Socket.prototype.setNoDelay = function(){}

Net.connect = function(options) {
  const socket = new Net.Socket()
  socket.connect(...options)
  return socket
}

window.Buffer = require('buffer/').Buffer
window.Monkey = require('../../src/monkey.js')
