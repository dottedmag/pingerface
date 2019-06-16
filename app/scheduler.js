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

function vibrate(buzzer) {
    setTimeout(()=>buzzer.stop(), 10*units.SEC);
    buzzer.start();
}

function startBzz(buzzer) {
  intervalHandle = setInterval(()=>vibrate(buzzer), bzzFrequency);
  vibrate(buzzer);
}

export function start(buzzer) {
  if (intervalHandle)
    return;
  let now = Math.floor(Date.now());
  let next = nextBzzTime(now);
  intervalHandle = setTimeout(()=>startBzz(buzzer), next-now);
}

export function stop(buzzer) {
  buzzer.stop();
  if (!intervalHandle)
    return;
  clearInterval(intervalHandle);
  intervalHandle = undefined;
}
