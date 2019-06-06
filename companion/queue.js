import { localStorage } from 'local-storage';

export class Queue {
    constructor(storage) {
        this.storage = storage;
    }

    enqueue(value) {
        let head = this.storage.getNumber('head', 0);
        this.storage.set(head, value);
        this.storage.set('head', head+1);
    }

    length() {
        let span = this.currentSpan();
        return span.head - span.tail;
    }

    currentSpan() {
        let head = this.storage.getNumber('head', 0);
        let tail = this.storage.getNumber('tail', 0);
        return {head, tail};
    }

    spanData(span) {
        let data = [];
        for (let i = span.tail; i < span.head; i++) {
            let item = this.storage.get(i);
            if (item !== null) // XXX add logging of unexpected situation
                data.push(item);
        }
        return data;
    }

    dequeueSpan(span) {
        if (this.storage.getNumber('tail', 0) != span.tail) {
            throw new Error('dequeSpan() on stale span');
        }
        this.storage.set('tail', span.head);
        for (let i = span.tail; i < span.head; i++) {
            this.storage.remove(i);
        }
    }
}
