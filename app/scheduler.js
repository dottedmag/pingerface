/* global setTimeout setInterval clearInterval */
import { vibrate } from './vibrate';

let intervalHandle;

const second = 1000;
const minute = 60*second;

const bzzFrequency = 10*minute;
const bzzOffset = 5*minute;

function divCeil(a, b) {
  return Math.ceil(a/b)*b;
}

function nextBzzTime(now) {
  return divCeil(now - bzzOffset, bzzFrequency) + bzzOffset;
}

function startBzz() {
  intervalHandle = setInterval(vibrate, bzzFrequency);
  vibrate();
}

export function start() {
  if (intervalHandle)
    return;
  let now = Math.floor(Date.now());
  let next = nextBzzTime(now);
  intervalHandle = setTimeout(startBzz, next-now);
}

export function stop() {
  if (!intervalHandle)
    return;
  clearInterval(intervalHandle);
  intervalHandle = undefined;
}
