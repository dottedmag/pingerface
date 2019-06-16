/* global setInterval, clearInterval */
import { vibration } from "haptics";
import { display } from "display";

const SEC = 1000;
const REENABLE = SEC/2;

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
