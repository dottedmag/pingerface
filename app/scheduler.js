/* global setTimeout setInterval clearInterval */
import { vibrate } from './vibrate';
import * as units from './units';
import * as config from './config';

const wakeupFrequency = config.wakeupFrequency;
const wakeupOffset = wakeupFrequency/2;

function divCeil(a, b) {
    return Math.ceil(a/b)*b;
}

function nextWakeupTime(now) {
    return divCeil(now - wakeupOffset, wakeupFrequency) + wakeupOffset;
}

export class Scheduler {
    constructor(cb) {
        this.cb = cb;
        this.interval = null;
    }

    start() {
        if (this.interval == null) {
            let now = Math.floor(Date.now());
            let next = nextWakeupTime(now);
            this.interval = setTimeout(()=>{
                this.cb();
                this.interval = setInterval(()=>this.cb(), wakeupFrequency);
            }, next-now);
        }
    }

    stop() {
        if (this.interval != null) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}
