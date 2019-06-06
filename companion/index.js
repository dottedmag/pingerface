/* global fetch */
import asap from 'fitbit-asap/companion';

import { Queue } from './queue';
import { TypedStorage, settingsStorage } from './storage';
import { BackoffSender, FATAL, TRANSIENT, SUCCEEDED } from './backoff';

const ENDPOINT_URL = 'https://tea.dottedmag.net/upload';

let sendQueue = new Queue(new TypedStorage('queue/'));

function send(result) {
    let data = {};
    let span = sendQueue.currentSpan();
    for (let item of sendQueue.spanData(span)) {
        // XXX add catch of non-JSON
        item = JSON.parse(item);
        data[item.date] = item.activity;
    }

    let token = settingsStorage.get('sync-token');
    let req = {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {Authorization: 'Bearer '+token}
    };

    fetch(ENDPOINT_URL, req).then((resp) => {
        if (resp.ok)
            sendQueue.dequeueSpan(span);
        // XXX add logging of non-200 results
        console.log(resp.status);
        resp.text().then(text=>console.log(text));
        if (resp.ok) {
            result(SUCCEEDED);
        } else if (resp.status >= 400 && resp.status < 500) {
            result(FATAL);
        } else {
            result(TRANSIENT);
        }
    }).catch((e) => {
        console.log(e.stack||e);
        // XXX add logging of errors
        result(FATAL);
    });
}

let backoff = new BackoffSender(send);

console.log('Starting companion');

asap.onmessage = message => {
    console.log('message received');
    try {
        let val = JSON.stringify(
            {date: message.date, activity: message.activity});
        sendQueue.enqueue(val);
        backoff.send();
    } catch(e) {
        // XXX add sending logs somewhere
        console.log(e.stack||e);
    }
};

// If our sender failed due to wrong sync token, reset it
settingsStorage.onChange(ev => {
    if (ev.key == 'sync-token') {
        backoff.reset();
    }
});
