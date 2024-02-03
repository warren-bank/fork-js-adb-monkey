const Api = require('./api');
const Command = require('./command');

class Multi extends Api {
  constructor(monkey) {
    super()
    this.monkey = monkey;
    this.commands = [];
    this.replies = [];
    this.errors = [];
    this.counter = 0;
    this.sent = false;
    this.callback = null;
    this.collector = (err, result, cmd) => {
      if (err) { this.errors.push(`${cmd}: ${err.message}`); }
      this.replies.push(result);
      this.counter -= 1;
      return this._maybeFinish();
    };
  }

  _maybeFinish() {
    if (this.counter === 0) {
      if (this.errors.length) {
        setImmediate(() => {
          return this.callback(new Error(this.errors.join(', ')));
        });
      } else {
        setImmediate(() => {
          return this.callback(null, this.replies);
        });
      }
    }
  }

  _forbidReuse() {
    if (this.sent) {
      throw new Error("Reuse not supported");
    }
  }

  send(command) {
    this._forbidReuse();
    this.commands.push(new Command(command, this.collector));
  }

  execute(callback) {
    this._forbidReuse();
    this.counter = this.commands.length;
    this.sent = true;
    this.callback = callback;
    if (this.counter === 0) {
      return;
    }
    const parts = [];
    for (var command of Array.from(this.commands)) {
      this.monkey.commandQueue.enqueue(command);
      parts.push(command.command);
    }
    parts.push('');
    this.commands = [];
    this.monkey.stream.write(parts.join('\n'));
  }
}

module.exports = Multi;
