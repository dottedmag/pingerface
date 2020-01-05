import document from "document";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function zeroPad(i) {
    if (i < 10)
        return "0" + i;
    return i;
}

let answerEls = [];
let clickerEls = [];
for (let i = 0; i < 4; i++) {
    answerEls[i] = document.getElementById("answer-"+i);
    clickerEls[i] = document.getElementById("clicker-"+i);
}

const questionEl = document.getElementById("question");
const underlayEl = document.getElementById("underlay");
const timeEl = document.getElementById("time");
const timeSmallEl = document.getElementById("time-small");
const dateEl = document.getElementById("date");
const dateSmallEl = document.getElementById("date-small");

function drawClock(date) {
    let today = date;
    let hours = zeroPad(today.getHours());
    let mins = zeroPad(today.getMinutes());
    let day = zeroPad(today.getDate());
    let month = months[today.getMonth()];
    timeEl.text = `${hours}:${mins}`;
    timeSmallEl.text = `${hours}:${mins}`;
    dateEl.text = `${day} ${month}`;
    dateSmallEl.text = `${day} ${month}`;
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
            for (let i = 0; i < 4; i++) {
                answerEls[i].style.visibility = "hidden";
                clickerEls[i].style.visibility = "hidden";
            }
            underlayEl.style.visibility = "hidden";
            questionEl.style.visibility = "hidden";
            dateSmallEl.style.visibility = "hidden";
            timeSmallEl.style.visibility = "hidden";
        } else {
            for (let i = 0; i < 4; i++) {
                answerEls[i].style.visibility = "visible";
                answerEls[i].text = answers[i];
                clickerEls[i].style.visibility = "visible";
            }
            underlayEl.style.visibility = "visible";
            questionEl.style.visibility = "visible";
            questionEl.text = `${question}`;
            dateSmallEl.style.visibility = "visible";
            timeSmallEl.style.visibility = "visible";
        }
    }
}
