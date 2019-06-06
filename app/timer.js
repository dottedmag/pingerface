/* global setTimeout, clearTimeout */
import { divCeil } from '../common/math';

function nextTimeout(timer) {
    return divCeil(Date.now() - timer.offset, timer.frequency) + timer.offset;
}

function arm(timer){
    timer.nextTimestamp = nextTimeout(timer);
    setTimeout(callback, timer.nextTimestamp-Date.now(), timer);
}

function callback(timer) {
    timer.timeoutID = timer.fn(timer.nextTimestamp);
    arm(timer);
}

export function start(frequency, offset, fn) {
    let timer = {
        frequency: frequency,
        offset: offset,
        fn: fn,
    };
    arm(timer);
    return timer;
}

export function stop(timer) {
    clearTimeout(timer.timeoutID);
}
