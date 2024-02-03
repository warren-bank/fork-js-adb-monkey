const Api = require('./api');
const Command = require('./command');
const Reply = require('./reply');
const Queue = require('./queue');
const Multi = require('./multi');
const Parser = require('./parser');

class Client extends Api {
  constructor() {
    this.commandQueue = new Queue;
    this.parser = new Parser;
    this.stream = null;
  }

  _hook() {
    this.stream.on('data', data => {
      return this.parser.parse(data);
    });
    this.stream.on('error', err => {
      return this.emit('error', err);
    });
    this.stream.on('end', () => {
      return this.emit('end');
    });
    this.stream.on('finish', () => {
      return this.emit('finish');
    });
    this.parser.on('reply', reply => {
      return this._consume(reply);
    });
    this.parser.on('error', err => {
      return this.emit('error', err);
    });
  }

  _consume(reply) {
    let command;
    if (command = this.commandQueue.dequeue()) {
      if (reply.isError()) {
        command.callback(reply.toError(), null, command.command);
      } else {
        command.callback(null, reply.value, command.command);
      }
    } else {
      throw new Error("Command queue depleted, but replies still coming in");
    }
  }

  connect(stream) {
    this.stream = stream;
    this._hook();
    return this;
  }

  end() {
    this.stream.end();
    return this;
  }

  send(commands, callback) {
    if (Array.isArray(commands)) {
      for (var command of Array.from(commands)) {
        this.commandQueue.enqueue(new Command(command, callback));
      }
      this.stream.write(`${commands.join('\n')}\n`);
    } else {
      this.commandQueue.enqueue(new Command(commands, callback));
      this.stream.write(`${commands}\n`);
    }
    return this;
  }

  multi() {
    return new Multi(this);
  }
}

module.exports = Client;
