class Command {
  constructor(command, callback) {
    this.command = command;
    this.callback = callback;
    this.next = null;
  }
}

module.exports = Command;
