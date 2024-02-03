const {expect} = require('chai');

const Command = require('../../src/monkey/command');

describe('Command', function() {

  it("should have a 'command' property set", function(done) {
    const cmd = new Command('a', function() {});
    expect(cmd.command).to.equal('a');
    return done();
  });

  it("should have a 'callback' property set", function(done) {
    const callback = function() {};
    const cmd = new Command('b', callback);
    expect(cmd.callback).to.equal(callback);
    return done();
  });

  return it("should have a 'next' property for the queue", function(done) {
    const cmd = new Command('c', function() {});
    expect(cmd.next).to.be.null;
    return done();
  });
});
