const Event = require('./Event.js').Event;

class NgramSuccessorModel {
    constructor() {
        this.successorMap = new Map();
        this.occurence = 0;
    }

    getProbability(event) {
        if (event == null || event == undefined) {
            throw 'cannot learn null or undefined';
        }
        if (!(event instanceof Event)) {
            throw 'cannot learn event not Event';
        }

        let successor = this.successorMap.get(event.key)
        if (successor == undefined)  {
            return 0;
        }
        return successor.occurence / this.occurence;

    }

    learn(event) {
        if (event == null || event == undefined) {
            throw 'cannot learn null or undefined';
        }
        if (!(event instanceof Event)) {
            throw 'cannot learn event not Event';
        }

        let successor = this.successorMap.get(event.key);
        if (successor == undefined) {
            successor = {
                event : event,
                occurence : 1
            }
        } else {
            successor.occurence++;
        }
        this.occurence++;
        this.successorMap.set(event.key, successor);
    }

}

module.exports.NgramSuccessorModel = NgramSuccessorModel;