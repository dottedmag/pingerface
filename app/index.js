import { me } from "appbit";
import { startWatch } from "./watch";
import * as scheduler from "./scheduler";
import { BodyPresenceSensor } from "body-presence";

me.appTimeoutEnabled = false;

let bps = new BodyPresenceSensor();

function onReading() {
    if (bps.present) {
        scheduler.start();
    } else {
        scheduler.stop();
    }
}
bps.onreading = onReading;
bps.start();

startWatch();
