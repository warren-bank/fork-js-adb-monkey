const {expect} = require('chai');

const Parser = require('../../src/monkey/parser');
const Reply = require('../../src/monkey/reply');

describe('Parser', function() {

  it("should emit 'wait' when waiting for more data", function(done) {
    const parser = new Parser;
    parser.on('wait', done);
    return parser.parse(Buffer.from('OK'));
  });

  it("should emit 'drain' when all data has been consumed", function(done) {
    const parser = new Parser;
    parser.on('drain', done);
    return parser.parse(Buffer.from('OK\n'));
  });

  it("should parse a successful reply", function(done) {
    const parser = new Parser;
    parser.on('reply', function(reply) {
      expect(reply.type).to.equal('OK');
      expect(reply.value).to.be.null;
      expect(reply.isError()).to.equal(false);
      return done();
    });
    return parser.parse(Buffer.from('OK\n'));
  });

  it("should parse a successful reply with value", function(done) {
    const parser = new Parser;
    parser.on('reply', function(reply) {
      expect(reply.type).to.equal('OK');
      expect(reply.value).to.equal('2');
      return done();
    });
    return parser.parse(Buffer.from('OK:2\n'));
  });

  it("should parse a successful reply with spaces in value", function(done) {
    const parser = new Parser;
    parser.on('reply', function(reply) {
      expect(reply.type).to.equal('OK');
      expect(reply.value).to.equal('a b c');
      return done();
    });
    return parser.parse(Buffer.from('OK:a b c\n'));
  });

  it("should parse an empty successful reply", function(done) {
    const parser = new Parser;
    parser.on('reply', function(reply) {
      expect(reply.type).to.equal('OK');
      expect(reply.value).to.equal('');
      return done();
    });
    return parser.parse(Buffer.from('OK:\n'));
  });

  it("should not trim values in successful replies", function(done) {
    const parser = new Parser;
    parser.on('reply', function(reply) {
      expect(reply.type).to.equal('OK');
      expect(reply.value).to.equal(' test ');
      return done();
    });
    return parser.parse(Buffer.from('OK: test \n'));
  });

  it("should not trim values in error replies", function(done) {
    const parser = new Parser;
    parser.on('reply', function(reply) {
      expect(reply.type).to.equal('ERROR');
      expect(reply.value).to.equal(' test ');
      return done();
    });
    return parser.parse(Buffer.from('ERROR: test \n'));
  });

  it("should parse an error reply with value", function(done) {
    const parser = new Parser;
    parser.on('reply', function(reply) {
      expect(reply.type).to.equal('ERROR');
      expect(reply.value).to.equal('unknown var');
      expect(reply.isError()).to.equal(true);
      expect(reply.toError()).to.be.an.instanceof(Error);
      expect(reply.toError().message).to.equal('unknown var');
      return done();
    });
    return parser.parse(Buffer.from('ERROR:unknown var\n'));
  });

  it("should throw a SyntaxError for an unknown reply", function(done) {
    const parser = new Parser;
    parser.on('error', function(err) {
      expect(err).to.be.an.instanceOf(SyntaxError);
      return done();
    });
    return parser.parse(Buffer.from('FOO:bar\n'));
  });

  return it("should parse multiple replies from one chunk", function(done) {
    const parser = new Parser;
    parser.once('reply', function(reply) {
      expect(reply.type).to.equal('OK');
      expect(reply.value).to.equal('2');
      return parser.once('reply', function(reply) {
        expect(reply.type).to.equal('OK');
        expect(reply.value).to.equal('okay');
        return done();
      });
    });
    return parser.parse(Buffer.from('OK:2\nOK:okay\n'));
  });
});
