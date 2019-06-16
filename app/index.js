import { me } from "appbit";
import { startWatch } from "./watch";
import * as vibrate from "./vibrate";
import { BodyPresenceSensor } from "body-presence";

me.appTimeoutEnabled = false;

let bps = new BodyPresenceSensor();

function onReading() {
    if (bps.present) {
        vibrate.start();
    } else {
        vibrate.stop();
    }
}
bps.onreading = onReading;
bps.start();

startWatch();
