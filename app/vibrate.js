/* global setInterval, clearInterval */
import { vibration } from "haptics";
import { display } from "display";
import * as units from './units';

const REENABLE = units.SEC/2;

export function buzzer() {
    let intervalHandle = null;
    return {
        start: ()=>{
            intervalHandle = setInterval(()=>{
                vibration.start("nudge-max");
                display.poke();
            }, REENABLE);
        },
        stop: ()=>{
            vibration.stop();
            clearInterval(intervalHandle);
        },
    };
}
