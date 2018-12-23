import { me } from "appbit";
import { startWatch } from "./watch";
import { startVibrate } from "./vibrate";

me.appTimeoutEnabled = false;

startWatch();
startVibrate();
