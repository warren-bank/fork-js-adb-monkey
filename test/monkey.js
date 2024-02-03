const Net = require('net');
const {expect} = require('chai');

const Monkey = require('../');
const Connection = require('../src/monkey/connection');
const Client = require('../src/monkey/client');
const MockDuplex = require('./mock/duplex');

describe('Monkey', function() {

  describe('Connection', () => it("should be exposed", function(done) {
    expect(Monkey.Connection).to.equal(Connection);
    return done();
  }));

  describe('Client', () => it("should be exposed", function(done) {
    expect(Monkey.Client).to.equal(Client);
    return done();
  }));

  describe('connect(options)', function() {

    before(function(done) {
      this.port = 16609;
      this.server = Net.createServer();
      return this.server.listen(this.port, done);
    });

    it("should return a Connection instance", function(done) {
      const monkey = Monkey.connect({port: this.port});
      expect(monkey).to.be.an.instanceOf(Connection);
      return done();
    });

    return after(function(done) {
      this.server.close();
      return done();
    });
  });

  return describe('connectStream(stream)', function() {

    before(function(done) {
      this.duplex = new MockDuplex;
      return done();
    });

    it("should return a Client instance", function(done) {
      const monkey = Monkey.connectStream(this.duplex);
      expect(monkey).to.be.an.instanceOf(Client);
      return done();
    });

    return it("should pass stream to Client", function(done) {
      const monkey = Monkey.connectStream(this.duplex);
      expect(monkey.stream).to.equal(this.duplex);
      return done();
    });
  });
});
