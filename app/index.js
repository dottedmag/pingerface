import { me } from "appbit";
import { State } from "./app";
import clock from "clock";
import * as watch from "./watch";
import * as scheduler from "./scheduler";
import * as attention from "./attention";
import { BodyPresenceSensor } from "body-presence";

me.appTimeoutEnabled = false;

let app = new State();

let a = new attention.Attention();

let s = new scheduler.Scheduler(()=>{
    console.log('wakeup scheduled');
    app.onTenMinutesPassed();
    reconcile();
});

let w = new watch.Watch((id) => {
    console.log(`onclick id=${id}`);
    app.onClick(id);
    reconcile();
});

const reconcile = () => {
    console.log(`reconcile enabled=${app.enabled} question=${app.question} `+
                `correct_answer=${app.correct_answer}`);
    if (app.question != null) {
        a.grab();
    } else {
        a.release();
    }

    if (app.enabled) {
        console.log('scheduler start');
        s.start();
    } else {
        console.log('scheduler stop');
        s.stop();
    }

    w.draw(app.getQuestionText(), app.getAnswersText());
};

let bps = new BodyPresenceSensor();
bps.onreading = ()=>{
    console.log(`body present=${bps.present}`);
    if (bps.present)
        app.onBodyPresent();
    else
        app.onBodyAbsent();
    reconcile();
};
bps.start();

clock.granularity = "minutes";
clock.ontick = ()=>{
    console.log('clock tick');
    app.onMinutePassed();
    reconcile();
};

reconcile();
