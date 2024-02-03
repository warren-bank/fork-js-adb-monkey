const Sinon = require('sinon');
const Chai = require('Chai');
Chai.use(require('sinon-chai'));
const {expect} = Chai;

const Multi = require('../../src/monkey/multi');
const Client = require('../../src/monkey/client');
const MockDuplex = require('../mock/duplex');
const Api = require('../../src/monkey/api');

describe('Multi', function() {

  beforeEach(function() {
    this.duplex = new MockDuplex;
    this.monkey = new Client().connect(this.duplex);
    return this.multi = new Multi(this.monkey);
  });

  it("should implement Api", function(done) {
    expect(this.multi).to.be.an.instanceOf(Api);
    return done();
  });

  it("should set 'monkey' property", function(done) {
    expect(this.multi.monkey).to.be.equal(this.monkey);
    return done();
  });

  describe("send(command)", function() {

    it("should not write to stream", function(done) {
      Sinon.spy(this.duplex, 'write');
      this.multi.send('foo');
      expect(this.duplex.write).to.not.have.been.called;
      return done();
    });

    return it("should throw an Error if run after execute()", function(done) {
      Sinon.spy(this.duplex, 'write');
      this.multi.execute(function() {});
      expect(() => this.multi.send('foo')).to.throw(Error);
      return done();
    });
  });

  return describe("execute(callback)", function() {

    it("should write to stream if commands were sent", function(done) {
      Sinon.spy(this.duplex, 'write');
      this.multi.send('foo');
      this.multi.execute(function() {});
      expect(this.duplex.write).to.have.been.calledOnce;
      return done();
    });

    it("should not write to stream if commands were not sent", function(done) {
      Sinon.spy(this.duplex, 'write');
      this.multi.execute(function() {});
      expect(this.duplex.write).to.not.have.been.called;
      return done();
    });

    it("should throw an Error if reused", function(done) {
      Sinon.spy(this.duplex, 'write');
      this.multi.execute(function() {});
      expect(() => this.multi.execute(function() {})).to.throw(Error);
      return done();
    });

    it("should write command to stream", function(done) {
      Sinon.spy(this.duplex, 'write');
      this.multi.send('foo');
      this.multi.execute(function() {});
      expect(this.duplex.write).to.have.been.calledWith('foo\n');
      return done();
    });

    it("should write multiple commands to stream at once", function(done) {
      Sinon.spy(this.duplex, 'write');
      this.multi.send('tap 1 2');
      this.multi.send('getvar foo');
      this.multi.execute(function() {});
      expect(this.duplex.write).to.have.been.calledWith('tap 1 2\ngetvar foo\n');
      return done();
    });

    return describe("callback", () => it("should be called just once with all results", function(done) {
      this.duplex.on('write', () => {
        return this.duplex.causeRead('OK\nOK:bar\n');
      });
      this.multi.send('tap 1 2');
      this.multi.send('getvar foo');
      return this.multi.execute((err, results) => done());
    }));
  });
});
