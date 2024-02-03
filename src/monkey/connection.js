const Net = require('net');

const Client = require('./client');

class Connection extends Client {
  constructor() {
    super()
  }

  connect(options) {
    const stream = Net.connect(options);
    stream.setNoDelay(true);
    return super.connect(stream);
  }

  _hook() {
    this.stream.on('connect', () => {
      return this.emit('connect');
    });
    this.stream.on('close', hadError => {
      return this.emit('close', hadError);
    });
    return super._hook();
  }
}

module.exports = Connection;
