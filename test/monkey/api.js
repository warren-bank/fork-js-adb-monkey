const Sinon = require('sinon');
const Chai = require('Chai');
Chai.use(require('sinon-chai'));
const {expect} = Chai;

const Api = require('../../src/monkey/api');

describe('Api', function() {

  beforeEach(function() {
    this.api = new Api;
    return Sinon.stub(this.api, 'send');
  });

  describe("keyDown(keyCode)", () => it("should send a 'key down <keyCode>' command", function(done) {
    let callback;
    this.api.keyDown('a', (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('key down a', callback);
    return done();
  }));

  describe("keyUp(keyCode)", () => it("should send a 'key up <keyCode>' command", function(done) {
    let callback;
    this.api.keyUp('b', (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('key up b', callback);
    return done();
  }));

  describe("touchDown(x, y)", () => it("should send a 'touch down <x> <y>' command", function(done) {
    let callback;
    this.api.touchDown(6, 7, (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('touch down 6 7', callback);
    return done();
  }));

  describe("touchUp(x, y)", () => it("should send a 'touch up <x> <y>' command", function(done) {
    let callback;
    this.api.touchUp(97, 22, (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('touch up 97 22', callback);
    return done();
  }));

  describe("touchMove(x, y)", () => it("should send a 'touch move <x> <y>' command", function(done) {
    let callback;
    this.api.touchMove(27, 88, (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('touch move 27 88', callback);
    return done();
  }));

  describe("trackball(dx, dy)", () => it("should send a 'trackball <dx> <dy>' command", function(done) {
    let callback;
    this.api.trackball(90, 92, (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('trackball 90 92', callback);
    return done();
  }));

  describe("flipOpen()", () => it("should send a 'flip open' command", function(done) {
    let callback;
    this.api.flipOpen(callback = function() {});
    expect(this.api.send).to.have.been.calledWith('flip open', callback);
    return done();
  }));

  describe("flipClose()", () => it("should send a 'flip close' command", function(done) {
    let callback;
    this.api.flipClose(callback = function() {});
    expect(this.api.send).to.have.been.calledWith('flip close', callback);
    return done();
  }));

  describe("wake()", () => it("should send a 'wake' command", function(done) {
    let callback;
    this.api.wake(callback = function() {});
    expect(this.api.send).to.have.been.calledWith('wake', callback);
    return done();
  }));

  describe("tap(x, y)", () => it("should send a 'tap <x> <y>' command", function(done) {
    let callback;
    this.api.tap(6, 2, (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('tap 6 2', callback);
    return done();
  }));

  describe("press(keyCode)", () => it("should send a 'press <keyCode>' command", function(done) {
    let callback;
    this.api.press('c', (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('press c', callback);
    return done();
  }));

  describe("type(string)", function() {

    it("should send a 'type <string>' command", function(done) {
      let callback;
      this.api.type('foo', (callback = function() {}));
      expect(this.api.send).to.have.been.calledWith('type foo', callback);
      return done();
    });

    it("should wrap string in quotes if string contains spaces", function(done) {
      let callback;
      this.api.type('a b', (callback = function() {}));
      expect(this.api.send).to.have.been.calledWith('type "a b"', callback);
      return done();
    });

    return it("should escape double quotes with '\\'", function(done) {
      let callback;
      this.api.type('a"', (callback = function() {}));
      expect(this.api.send).to.have.been.calledWith('type a\\"', callback);
      this.api.type('a" b"', (callback = function() {}));
      expect(this.api.send).to.have.been.calledWith('type "a\\" b\\""', callback);
      return done();
    });
  });

  describe("list()", () => it("should send a 'listvar' command", function(done) {
    let callback;
    this.api.list(callback = function() {});
    // @todo Don't ignore the callback.
    expect(this.api.send).to.have.been.calledWith('listvar');
    return done();
  }));

  describe("get(varname)", () => it("should send a 'getvar <varname>' command", function(done) {
    let callback;
    this.api.get('foo', (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('getvar foo', callback);
    return done();
  }));

  describe("quit()", () => it("should send a 'quit' command", function(done) {
    let callback;
    this.api.quit(callback = function() {});
    expect(this.api.send).to.have.been.calledWith('quit', callback);
    return done();
  }));

  describe("done()", () => it("should send a 'done' command", function(done) {
    let callback;
    this.api.done(callback = function() {});
    expect(this.api.send).to.have.been.calledWith('done', callback);
    return done();
  }));

  return describe("sleep(<ms>)", () => it("should send a 'sleep <ms>' command", function(done) {
    let callback;
    this.api.sleep(500, (callback = function() {}));
    expect(this.api.send).to.have.been.calledWith('sleep 500', callback);
    return done();
  }));
});
