const Client = require('./monkey/client');
const Connection = require('./monkey/connection');

class Monkey {

  static connect(options) {
    return new Connection().connect(options);
  }

  static connectStream(stream) {
    return new Client().connect(stream);
  }
}

Monkey.Connection = Connection;
Monkey.Client = Client;

module.exports = Monkey;
