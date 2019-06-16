/* global setInterval, clearInterval */
import { vibration } from "haptics";
import { display } from "display";
import * as units from './units';

const RESTART = units.SEC/2;

export function grabber() {
    let intervalHandle = null;
    return {
        start: ()=>{
            intervalHandle = setInterval(()=>{
                vibration.start("nudge-max");
                display.poke();
            }, RESTART);
        },
        stop: ()=>{
            vibration.stop();
            clearInterval(intervalHandle);
        },
    };
}
