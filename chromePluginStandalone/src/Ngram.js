const Event = require('./Event.js').Event;

class Ngram {
    constructor(eventList) {
        if (eventList === null || eventList === undefined) {
            throw 'Cannot create Ngram with null or undefined eventList';
        }
        if (!Array.isArray(eventList)) {
            throw 'Cannot create Ngram with isArray(eventList) false';
        }
        eventList.forEach(event => {
            if (!(event instanceof Event)) {
                throw 'Cannot create Ngram, one event is not an Event';
            }
        });
        this.eventList = eventList;
        this.size = eventList.lenght;
        this.key = eventList.map(el => el.key).reduce((accu, cur) => accu + cur, '');
    }
}

module.exports.Ngram = Ngram;