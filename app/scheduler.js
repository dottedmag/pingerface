/* global setTimeout setInterval clearInterval */
import { vibrate } from './vibrate';
import * as units from './units';

let intervalHandle;

const bzzFrequency = 10*units.MIN;
const bzzOffset = 5*units.MIN;

function divCeil(a, b) {
  return Math.ceil(a/b)*b;
}

function nextBzzTime(now) {
  return divCeil(now - bzzOffset, bzzFrequency) + bzzOffset;
}

function vibrate(attentionGrabber) {
    setTimeout(()=>attentionGrabber.stop(), 10*units.SEC);
    attentionGrabber.start();
}

function startBzz(attentionGrabber) {
  intervalHandle = setInterval(()=>vibrate(attentionGrabber), bzzFrequency);
  vibrate(attentionGrabber);
}

export function start(attentionGrabber) {
  if (intervalHandle)
    return;
  let now = Math.floor(Date.now());
  let next = nextBzzTime(now);
  intervalHandle = setTimeout(()=>startBzz(attentionGrabber), next-now);
}

export function stop(attentionGrabber) {
  attentionGrabber.stop();
  if (!intervalHandle)
    return;
  clearInterval(intervalHandle);
  intervalHandle = undefined;
}
