/* global setInterval, clearInterval */
import { vibration } from "haptics";
import { display } from "display";
import * as units from './units';

const RESTART = units.SEC/2;

export class Attention {
    constructor() {
        this.interval = null;
    }

    grab() {
        if (this.interval==null) {
            this.interval = setInterval(()=>{
                vibration.start("nudge-max");
                display.poke();
            }, RESTART);
        }
    }

    release() {
        if (this.interval!=null) {
            vibration.stop();
            clearInterval(this.interval);
            this.interval=null;
        }
    }
}
