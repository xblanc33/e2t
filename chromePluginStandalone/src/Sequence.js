const Ngram = require('./Ngram.js').Ngram;
const Event = require('./Event.js').Event;

class Sequence {
    constructor(eventList, name) {
        this.name = name;
        if (eventList === null || eventList === undefined) {
            this.eventList = [];
            this.length = 0;
        } else {
            if (! Array.isArray(eventList)) {
                throw 'Cannot create sequence with Array.isArray(eventList) === false';
            }
            eventList.forEach(event => {
                if (!(event instanceof Event)) {
                    throw 'Cannot create sequence with array containing a not Event'
                }
            })
            this.eventList = eventList;
            this.length = eventList.length;
        }
    }

    append(event) {
        if (event == null || event == undefined) {
            throw 'cannot append null or undefined';
        }
        if (!(event instanceof Event)) {
            throw 'cannot append event not Event';
        }
        this.eventList.push(event);
        this.length++;
    }

    getNgram(beforeIndex, ngramSize) {
        let ngrameventList = [];
        if (beforeIndex > 0) {
            let from = Math.max(0,beforeIndex - ngramSize);
            for (let previousIndex = from; previousIndex < beforeIndex; previousIndex++) {
                ngrameventList.push(this.eventList[previousIndex]);
            }
        }
        return new Ngram(ngrameventList);
    }
}

module.exports.Sequence = Sequence;