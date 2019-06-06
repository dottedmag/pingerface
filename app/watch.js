import clock from "clock";
import document from "document";
import asap from "fitbit-asap/app";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function zeroPad(i) {
  if (i < 10)
    return "0" + i;
  return i;
}

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

export function startWatch() {
  clock.granularity = "minutes";
  clock.ontick = onTick;
}
