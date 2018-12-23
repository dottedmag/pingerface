import { BodyPresenceSensor } from "body-presence";
import { vibration } from "haptics";

let intervalHandle;

const second = 1000;
const minute = 60*second;

const bzzFrequency = 10*minute;
const bzzOffset = 5*minute;
const bzzLength = 6*second;

function divCeil(a, b) {
  return Math.ceil(a/b)*b;
}

function nextBzzTime(now) {
  return divCeil(now - bzzOffset, bzzFrequency) + bzzOffset;
}

function bzz() {
  vibration.start("alert");
  setTimeout(function() {
    vibration.stop();
  }, bzzLength);
}

function startBzz() {
  intervalHandle = setInterval(bzz, bzzFrequency);
  bzz();
}

function start() {
  if (intervalHandle)
    return;
  let now = Math.floor(Date.now());
  let next = nextBzzTime(now);
  intervalHandle = setTimeout(startBzz, next-now);
}

function stop() {
  if (!intervalHandle)
    return;
  clearInterval(intervalHandle);
  intervalHandle = undefined;
}

let bps = new BodyPresenceSensor();

function onReading() {
  if (bps.present)
    start();
  else
    stop();
}

export function startVibrate() {
  bps.onreading = onReading;
  bps.start();
}
