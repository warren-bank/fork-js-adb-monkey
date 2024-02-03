const Net = require('net');
const Path = require('path');
const Sinon = require('sinon');
const Chai = require('chai');
Chai.use(require('sinon-chai'));
const {spawn} = require('child_process');
const {expect} = Chai;

const Connection = require('../../src/monkey/connection');
const Client = require('../../src/monkey/client');

describe('Connection', function() {

  before(function(done) {
    this.options = {port: 16610};
    this.server = Net.createServer();
    return this.server.listen(this.options.port, done);
  });

  after(function(done) {
    this.server.close();
    return done();
  });

  it("should extend Client", function(done) {
    const monkey = new Connection;
    expect(monkey).to.be.an.instanceOf(Client);
    return done();
  });

  it("should not create a connection immediately", function(done) {
    Sinon.spy(Net, 'connect');
    const monkey = new Connection;
    expect(Net.connect).to.not.have.been.called;
    Net.connect.restore();
    return done();
  });

  describe("events", () => it("should emit 'connect' when underlying stream does", function(done) {
    const monkey = new Connection().connect(this.options);
    return monkey.on('connect', () => done());
  }));

  return describe('connect(options)', () => it("should create a connection", function(done) {
    Sinon.spy(Net, 'connect');
    const monkey = new Connection().connect(this.options);
    expect(Net.connect).to.have.been.calledWith(this.options);
    Net.connect.restore();
    return done();
  }));
});
