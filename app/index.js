import { me } from "appbit";
import { startWatch } from "./watch";
import * as scheduler from "./scheduler";
import * as attention from "./attention";
import { BodyPresenceSensor } from "body-presence";

me.appTimeoutEnabled = false;

let grabber = attention.grabber();
let bps = new BodyPresenceSensor();

function onReading() {
    if (bps.present) {
        scheduler.start(grabber);
    } else {
        scheduler.stop(grabber);
    }
}
bps.onreading = onReading;
bps.start();

startWatch();
