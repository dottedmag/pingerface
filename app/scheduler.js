/* global setTimeout setInterval clearInterval */
import { vibrate } from './vibrate';
import * as units from './units';
import * as config from './config';

let intervalHandle;

const wakeupFrequency = config.wakeupFrequency;
const wakeupOffset = wakeupFrequency/2;

function divCeil(a, b) {
    return Math.ceil(a/b)*b;
}

function nextWakeupTime(now) {
    return divCeil(now - wakeupOffset, wakeupFrequency) + wakeupOffset;
}

function vibrate(attentionGrabber, acknowledger) {
    acknowledger.request(()=>{
        attentionGrabber.stop();
    });
    attentionGrabber.start();
}

function startWakeup(attentionGrabber, acknowledger) {
    intervalHandle = setInterval(()=>vibrate(attentionGrabber, acknowledger), wakeupFrequency);
    vibrate(attentionGrabber, acknowledger);
}

export function start(attentionGrabber, acknowledger) {
    if (intervalHandle)
        return;
    let now = Math.floor(Date.now());
    let next = nextWakeupTime(now);
    intervalHandle = setTimeout(()=>startWakeup(attentionGrabber, acknowledger), next-now);
}

export function stop(attentionGrabber, acknowledger) {
    attentionGrabber.stop();
    acknowledger.dismiss();
    if (!intervalHandle)
        return;
    clearInterval(intervalHandle);
    intervalHandle = undefined;
}
