/* global setTimeout, clearTimeout */

// Backoff has a typical state machine with one complication, 'sending with
// pending' state: if an asynchronous send operation is in progress, and a
// request to start another one comes, we need to mark that after send has
// finished it should be restarted again.
//
//         +-------send succeeded-------+   +----backoff expired----+
//         v                            |   v                       |
//      +------+                     +---------+               +---------+
//      | IDLE |--send() is called-->| SENDING |--send failed->| BACKOFF |-+
//      +------+                     +---------+  (transient)  +---------+ |
//         ^                          |  ^   |                    ^     ^  |
//         | +--send failed (fatal)---+  |   |                    |     |  |
// reset() | |                           |   | send() is called   |     +--+
// called  | |            send succeeded |   v                    |  send() is
//         | |                +--------------------+              |   called
//         | |                | SENDING (+pending) |--send failed-+
//         | |                +--------------------+  (transient)
//         | |       send() is called |   ^   |
//         | v                        +---+   |
//       +--------+                           |
//       | BROKEN |<--send failed (fatal)-----+
//       +--------+

const MIN_BACKOFF = 100;
const MAX_BACKOFF = 10*60*60*1000;
const COEFF = 2;

function clampMax(value, max) {
    return value > max ? max : value;
}

const IDLE = 0;
const SENDING = 1;
const BACKOFF = 2;
const SENDING_WITH_PENDING = 3;
const BROKEN = -1;

export const FATAL = -1;
export const TRANSIENT = 0;
export const SUCCEEDED = 1;

export class BackoffSender {
    constructor(asyncSender) {
        this.backoff = MIN_BACKOFF;
        this.asyncSender = asyncSender;
        this.state = IDLE;
    }
    send() {
        if (this.state == IDLE) {
            this._send();
        } else if (this.state == SENDING) {
            this.state = SENDING_WITH_PENDING;
        } else if (this.state == BROKEN) {
            throw new Error('Unable to send from broken state');
        }
    }
    reset() {
        if (this.state == BROKEN)
            this.state = IDLE;
    }
    _send(){
        try {
            console.log('sending...');
            this.state = SENDING;
            this.asyncSender(result => {
                if (result == SUCCEEDED) {
                    console.log('succeeded sending');
                    if (this.state == SENDING_WITH_PENDING) {
                        this._send();
                    } else {
                        this.state = IDLE;
                    }
                } else if (result == TRANSIENT) {
                    console.log('failed sending');
                    this._backoff();
                } else if (result == FATAL) {
                    console.log('fatal error in sending');
                    this.state = BROKEN;
                }
            });
        } catch(e) {
            console.log(e.stack||e);
        }
    }
    _backoff() {
        console.log('backing off');
        setTimeout(this._send.bind(this), this.backoff);
        this.backoff = clampMax(this.backoff*COEFF, MAX_BACKOFF);
    }
}
