import { me } from "appbit";
import { startWatch } from "./watch";
import * as scheduler from "./scheduler";
import * as vibrate from "./vibrate";
import { BodyPresenceSensor } from "body-presence";

me.appTimeoutEnabled = false;

let buzzer = vibrate.buzzer();
let bps = new BodyPresenceSensor();

function onReading() {
    if (bps.present) {
        scheduler.start(buzzer);
    } else {
        scheduler.stop(buzzer);
    }
}
bps.onreading = onReading;
bps.start();

startWatch();
