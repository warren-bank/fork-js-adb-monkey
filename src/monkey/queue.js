class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  enqueue(item) {
    if (this.tail) {
      this.tail.next = item;
    } else {
      this.head = item;
    }
    this.tail = item;
  }

  dequeue() {
    const item = this.head;
    if (item) {
      if (item === this.tail) {
        this.tail = null;
      }
      this.head = item.next;
      item.next = null;
    }
    return item;
  }
}

module.exports = Queue;
