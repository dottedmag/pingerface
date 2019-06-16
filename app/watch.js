import clock from "clock";
import document from "document";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function zeroPad(i) {
    if (i < 10)
        return "0" + i;
    return i;
}

const clickerEl = document.getElementById("clicker");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

function onTick(evt) {
    drawClock(evt.date);
}

function drawClock(date) {
    let today = date;
    let hours = zeroPad(today.getHours());
    let mins = zeroPad(today.getMinutes());
    let day = zeroPad(today.getDate());
    let month = months[today.getMonth()];
    timeEl.text = `${hours}:${mins}`;
    dateEl.text = `${day} ${month}`;
}

export function start() {
    clock.granularity = "minutes";
    clock.ontick = onTick;
}

export function acknowledger() {
    let fn = null;
    function done() {
        clickerEl.style.visibility = "hidden";
        timeEl.style.fill = "white";
        if (fn)
            fn();
    }
    clickerEl.onclick = done;
    return {
        request: (callback)=>{
            fn = callback;
            timeEl.style.fill = "red";
            clickerEl.style.visibility = "visible";
        },
        dismiss: done,
    };
}
