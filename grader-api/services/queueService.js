class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(element) {
        this.queue.push(element);
    }

    dequeue() {
        return this.queue.shift();
    }

    peek() {
        return this.queue.length > 0 ? this.queue[0] : null;
    }
}

const gradingQueue = new Queue();

const enQueue = (requestData) => {
    gradingQueue.enqueue(requestData);
};

const deQueue = () => {
    return gradingQueue.dequeue();
};

const peekQueue = () => {
    return gradingQueue.peek();
};

export { deQueue, enQueue, peekQueue };