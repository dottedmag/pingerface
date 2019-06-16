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

function vibrate(attentionGrabber) {
    setTimeout(()=>attentionGrabber.stop(), 10*units.SEC);
    attentionGrabber.start();
}

function startWakeup(attentionGrabber) {
  intervalHandle = setInterval(()=>vibrate(attentionGrabber), wakeupFrequency);
  vibrate(attentionGrabber);
}

export function start(attentionGrabber) {
  if (intervalHandle)
    return;
  let now = Math.floor(Date.now());
  let next = nextWakeupTime(now);
  intervalHandle = setTimeout(()=>startWakeup(attentionGrabber), next-now);
}

export function stop(attentionGrabber) {
  attentionGrabber.stop();
  if (!intervalHandle)
    return;
  clearInterval(intervalHandle);
  intervalHandle = undefined;
}
