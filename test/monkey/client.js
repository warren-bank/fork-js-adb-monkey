const Sinon = require('sinon');
const Chai = require('chai');
Chai.use(require('sinon-chai'));
const {expect} = Chai;

const Client = require('../../src/monkey/client');
const Api = require('../../src/monkey/api');
const Multi = require('../../src/monkey/multi');
const MockDuplex = require('../mock/duplex');

describe('Client', function() {

  beforeEach(function() {
    this.duplex = new MockDuplex;
    return this.monkey = new Client().connect(this.duplex);
  });

  it("should implement Api", function(done) {
    expect(this.monkey).to.be.an.instanceOf(Api);
    return done();
  });

  describe("events", function() {

    it("should emit 'finish' when underlying stream does", function(done) {
      this.monkey.on('finish', () => done());
      return this.duplex.end();
    });

    return it("should emit 'end' when underlying stream does", function(done) {
      this.monkey.on('end', () => done());
      this.duplex.on('write', () => {
        this.duplex.causeRead('OK\n');
        return this.monkey.end();
      });
      return this.monkey.send('foo', function() {});
    });
  });

  describe("connect(stream)", () => it("should set 'stream' property", function(done) {
    expect(this.monkey.stream).to.be.equal(this.duplex);
    return done();
  }));

  describe("end()", function() {

    it("should be chainable", function(done) {
      expect(this.monkey.end()).to.equal(this.monkey);
      return done();
    });

    return it("should end underlying stream", function(done) {
      this.duplex.on('finish', () => done());
      return this.monkey.end();
    });
  });

  describe("send(command, callback)", function() {

    it("should be chainable", function(done) {
      expect(this.monkey.send('foo', function() {})).to.equal(this.monkey);
      return done();
    });

    describe("with single command", () => it("should receive reply", function(done) {
      this.duplex.on('write', chunk => {
        expect(chunk.toString()).to.equal('give5\n');
        this.duplex.causeRead('OK:5\n');
        return this.monkey.end();
      });
      const callback = Sinon.spy();
      this.monkey.send('give5', callback);
      return this.duplex.on('finish', function() {
        expect(callback).to.have.been.calledOnce;
        expect(callback).to.have.been.calledWith(null, '5', 'give5');
        return done();
      });
    }));

    return describe("with multiple commands", () => it("should receive multiple replies", function(done) {
      this.duplex.on('write', chunk => {
        expect(chunk.toString()).to.equal('give5\ngiveError\ngive7\n');
        this.duplex.causeRead('OK:5\nERROR:foo\nOK:7\n');
        return this.monkey.end();
      });
      const callback = Sinon.spy();
      this.monkey.send(['give5', 'giveError', 'give7'], callback);
      return this.duplex.on('finish', function() {
        expect(callback).to.have.been.calledThrice;
        expect(callback).to.have.been.calledWith(null, '5', 'give5');
        expect(callback).to.have.been.calledWith( 
          Sinon.match.instanceOf(Error), null, 'giveError');
        expect(callback).to.have.been.calledWith(null, '7', 'give7');
        return done();
      });
    }));
  });

  return describe("multi()", function() {

    it("should return a Multi instance", function(done) {
      expect(this.monkey.multi()).to.be.an.instanceOf(Multi);
      return done();
    });

    return it("should be be bound to the Client instance", function(done) {
      const multi = this.monkey.multi();
      expect(multi.monkey).to.equal(this.monkey);
      return done();
    });
  });
});
