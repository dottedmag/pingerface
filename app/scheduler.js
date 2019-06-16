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

function vibrate(buzzer) {
    setTimeout(()=>buzzer.stop(), 10*second);
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
