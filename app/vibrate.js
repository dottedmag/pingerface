/* global setTimeout */
import { vibration } from "haptics";
import { display } from "display";

function continueBuzz(buzz) {
    if (buzz.pattern.length == buzz.i) {
        vibration.stop();
        return;
    }
    display.poke();
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

function randN(n) {
    return (Math.random()*n)|0;
}

function buzzLength() {
    return randN(3)*100+50;
}

export function vibrate() {
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
