const {expect} = require('chai');

const Queue = require('../../src/monkey/queue');
const Command = require('../../src/monkey/command');

describe('Queue', function() {

  describe("when empty", function() {

    before(function(done) {
      this.queue = new Queue;
      return done();
    });

    it("should have null tail and tail", function(done) {
      expect(this.queue.tail).to.be.null;
      expect(this.queue.head).to.be.null;
      return done();
    });

    return it("dequeue should return null", function(done) {
      expect(this.queue.dequeue()).to.be.null;
      return done();
    });
  });

  describe("with one command", function() {

    before(function(done) {
      this.queue = new Queue;
      this.command = new Command('a', function() {});
      this.queue.enqueue(this.command);
      return done();
    });

    it("should have the command as head", function(done) {
      expect(this.queue.head).to.equal(this.command);
      return done();
    });

    it("should have tail same as head", function(done) {
      expect(this.queue.head).to.equal(this.queue.tail);
      return done();
    });

    it("should have command.next be null", function(done) {
      expect(this.command.next).to.be.null;
      return done();
    });

    return it("dequeue should return the command and update tail and head", function(done) {
      expect(this.queue.dequeue()).to.equal(this.command);
      expect(this.queue.head).to.be.null;
      expect(this.queue.tail).to.be.null;
      return done();
    });
  });

  return describe("with multiple commands", function() {

    before(function(done) {
      this.queue = new Queue;
      this.command1 = new Command('a', function() {});
      this.command2 = new Command('b', function() {});
      this.command3 = new Command('c', function() {});
      this.queue.enqueue(this.command1);
      this.queue.enqueue(this.command2);
      this.queue.enqueue(this.command3);
      return done();
    });

    it("should set head to the first command", function(done) {
      expect(this.queue.head).to.equal(this.command1);
      return done();
    });

    it("should set tail to the last command", function(done) {
      expect(this.queue.tail).to.equal(this.command3);
      return done();
    });

    it("should set command.next properly", function(done) {
      expect(this.command1.next).to.equal(this.command2);
      expect(this.command2.next).to.equal(this.command3);
      expect(this.command3.next).to.be.null;
      return done();
    });

    return it("dequeue should return the first command and update head", function(done) {
      expect(this.queue.dequeue()).to.equal(this.command1);
      expect(this.command1.next).to.be.null;
      expect(this.queue.head).to.equal(this.command2);
      return done();
    });
  });
});
