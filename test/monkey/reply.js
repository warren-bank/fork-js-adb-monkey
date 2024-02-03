const {expect} = require('chai');

const Reply = require('../../src/monkey/reply');

describe('Reply', function() {

  describe('isError()', function() {

    it("should return false for OK reply", function(done) {
      const reply = new Reply(Reply.OK, null);
      expect(reply.isError()).to.equal(false);
      return done();
    });

    return it("should return true for ERROR reply", function(done) {
      const reply = new Reply(Reply.ERROR, null);
      expect(reply.isError()).to.equal(true);
      return done();
    });
  });

  return describe('toError()', function() {

    it("should throw an Error is called on an OK reply", function(done) {
      const reply = new Reply(Reply.OK, null);
      expect(() => reply.toError()).to.throw(Error);
      return done();
    });

    return it("should return an Error with the value as the message", function(done) {
      const reply = new Reply(Reply.ERROR, 'a b');
      const err = reply.toError();
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('a b');
      return done();
    });
  });
});
