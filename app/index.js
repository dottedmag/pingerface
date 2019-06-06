import { me } from 'appbit';
import { me as device } from 'device';
import { BodyPresenceSensor } from 'body-presence';
import document from 'document';

import { startWatch } from './watch';
import { start as timerStart, stop as timerStop } from './timer';
import { divFloor } from '../common/math';

me.appTimeoutEnabled = false;

const activities = [
    'Sex',
    'Drugs',
    'Rock-n-roll',
    'Work',
];

let state = {
    timer: null,
    timestampsAnswerPending: [],
    lastAnswer: null,
};

function onTimer(timestamp) {
    state.timestampsAnswerPending.append(timestamp);
    updateUI();
}

const MIN = 60*1000;
const OFFSET = 5*MIN;
const FREQUENCY = 10*MIN;

function start() {
    state.timer = timerStart(10*MIN, 5*MIN, onTimer);
}

function stop() {
    if (state.timer!=null)
        timerStop(state.timer);
    state.timer = null;
    state.timestampsAnswerPending = [];
    updateUI();
}

// Body Presence

let bps = new BodyPresenceSensor();
function bpsOnReading() {
    if (bps.present)
        start();
    else
        stop();
}
if (bps) {
    bps.onreading = bpsOnReading;
    bps.start();
} else {
    console.log('where is my fucking bps?');
}

startWatch();

//
// List format:
//
// [0] Current time slice
// [1] Snooze
// [2] Repeat last activity (if any)
// [3...] Activities
//

// function formatDate() {
//     let d = new Date().toISOString();
//     return d.substring(0, 10)+' '+d.substring(11, 19);
// }

let screen = document.getElementById('activity-screen');
let clicker = document.getElementById('clicker');
let list = document.getElementById('activity-list');

clicker.onclick = openActivityList;

function openActivityList() {
    screen.style.display = 'inline';
    resizeList();
};

function zeroPad(s, n) {
    s = ''+s;
    while (s.length<n)
        s ='0'+s;
    return s;
}

function formatTime(t) {
    let d = new Date(t);
    return zeroPad(d.getHours(),2)+':'+zeroPad(d.getMinutes(),2);
}

function formatTimeInterval() {
    let now = Date.now();
    let start = divFloor(now, FREQUENCY);
    let end = start+FREQUENCY;
    return formatTime(start)+'-'+formatTime(end);
}

function getTileInfo(index) {
    if (index == 0) {
        return {type: 'header-tile-pool', text: formatTimeInterval()};
    }
    if (index == 1) {
        return {type: 'snooze-tile-pool'};
    }
    if (index == 2 && state.lastAnswer != null) {
        return {type: 'again-tile-pool', text: state.lastAnswer};
    }
    if (index > 2 && state.lastAnswer != null) {
        return {type: 'activity-tile-pool', text: activities[index-3]};
    }
    return {type: 'activity-tile-pool', text: activities[index-2]};
}

function recenter(button) {
    let text = button.getElementById('text');
    let img = button.getElementById('image');
    let textRect = text.getBBox();
    let imgRect = img.getBBox();
    let textCenter = ((textRect.right+textRect.left)/2)|0;
    let screenCenter = device.screen.width/2;
    let offset = textCenter-screenCenter;
    if (offset != 0) {
        text.x = textRect.left - offset;
        img.x = text.x - imgRect.width - 10;
    }
}

function resizeList() {
    list.length = 2 + // header + snooze
        (state.lastAnswer!=null) + // again
        activities.length; // activities
}

function selectActivity(activity) {
    state.lastAnswer = activity;
    screen.style.display = 'none';
}

function snooze() {
    screen.style.display = 'none';
}

function close() {
    console.log('close');
    screen.style.display = 'none';
}

list.delegate = {
    getTileInfo: function(index) {
        return getTileInfo(index);
    },
    configureTile: function(tile, info) {
        if (info.type == 'header-tile-pool') {
            tile.getElementById('text').text = info.text;
            tile.getElementById('background').onclick = close;
            return;
        }
        if (info.type == 'snooze-tile-pool') {
            tile.getElementById('button').onclick = snooze;
            return;
        }
        if (info.type == 'again-tile-pool') {
            let button = tile.getElementById('button');
            button.text = info.text;
            recenter(button);
            button.onclick = ()=>{
                selectActivity(info.text);
            };
            return;
        }
        let button = tile.getElementById('button');
        button.text = info.text;
        button.onclick = ()=>{
            selectActivity(info.text);
        };
    },
};
resizeList();
