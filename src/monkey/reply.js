class Reply {
  static initClass() {
    this.ERROR = 'ERROR';
    this.OK = 'OK';
  }

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  isError() {
    return this.type === Reply.ERROR;
  }

  toError() {
    if (!this.isError()) {
      throw new Error('toError() cannot be called for non-errors');
    }
    return new Error(this.value);
  }
}
Reply.initClass();

module.exports = Reply;
