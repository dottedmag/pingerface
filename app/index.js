import { me } from "appbit";
import * as watch from "./watch";
import * as scheduler from "./scheduler";
import * as attention from "./attention";
import { BodyPresenceSensor } from "body-presence";

me.appTimeoutEnabled = false;

let grabber = attention.grabber();
let acknowledger = watch.acknowledger();
let bps = new BodyPresenceSensor();

function onReading() {
    if (bps.present) {
        scheduler.start(grabber, acknowledger);
    } else {
        scheduler.stop(grabber, acknowledger);
    }
}
bps.onreading = onReading;
bps.start();

watch.start();
