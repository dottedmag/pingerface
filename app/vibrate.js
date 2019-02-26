import { BodyPresenceSensor } from "body-presence";
import { vibration } from "haptics";

let intervalHandle;

const second = 1000;
const minute = 60*second;

const bzzFrequency = 10*minute;
const bzzOffset = 5*minute;

function continueBuzz(buzz) {
    if (buzz.pattern.length == buzz.i) {
        vibration.stop();
        return;
    }
    if (buzz.pattern[buzz.i].on) {
        vibration.start("alert");
    } else {
        vibration.stop();
    }
    setTimeout(function() {
        continueBuzz(buzz);
    }, buzz.pattern[buzz.i].len);
    buzz.i++;
}

function startBuzz(pattern) {
    var buzz = {pattern, i: 0};
    continueBuzz(buzz);
}

function divCeil(a, b) {
  return Math.ceil(a/b)*b;
}

function nextBzzTime(now) {
  return divCeil(now - bzzOffset, bzzFrequency) + bzzOffset;
}

function randN(n) {
    return (Math.random()*n)|0;
}

function buzzLength() {
    return randN(3)*100+50;
}

function bzz() {
    let pattern = [];
    let patternLength = 0;
    while (patternLength < 10000) {
        let b = buzzLength();
        pattern.push({on: true, len: b});
        pattern.push({len: 100});
        patternLength += b + 100;
    }
    startBuzz(pattern);
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
