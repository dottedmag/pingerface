import document from "document";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function zeroPad(i) {
    if (i < 10)
        return "0" + i;
    return i;
}

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

let answerEls = [];
let clickerEls = [];
for (let i = 0; i < 4; i++) {
    answerEls[i] = document.getElementById("answer-"+i);
    clickerEls[i] = document.getElementById("clicker-"+i);
}

const questionEl = document.getElementById("question");
const underlayEl = document.getElementById("underlay");
const timeSmallEl = document.getElementById("time-small");
const dateSmallEl = document.getElementById("date-small");

let overlayEls = [questionEl, underlayEl, timeSmallEl, dateSmallEl]
    .concat(answerEls, clickerEls);

function drawClock(date) {
    let today = date;
    let hours = zeroPad(today.getHours());
    let mins = zeroPad(today.getMinutes());
    let day = zeroPad(today.getDate());
    let month = months[today.getMonth()];
    timeEl.text = timeSmallEl.text = `${hours}:${mins}`;
    dateEl.text = dateSmallEl.text = `${day} ${month}`;
}

export class Watch {
    constructor(cb) {
        this.cb = cb;
        for (let i = 0; i < 4; i++) {
            let j = i; // capture
            clickerEls[j].onclick = ()=>{
                this.cb(j);
            };
        }
    }

    draw(question, answers) {
        drawClock(new Date());

        if (question == null) {
            for (let el of overlayEls)
                el.style.visibility = "hidden";
        } else {
            for (let i = 0; i < 4; i++)
                answerEls[i].text = answers[i];
            questionEl.text = `${question}`;
            for (let el of overlayEls)
                el.style.visibility = "visible";
        }
    }
}
