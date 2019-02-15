const Event = require('./Event.js').Event;
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

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
        })
        this.eventList = eventList;
        this.size = eventList.lenght;
        this.key = eventList.map(el => el.key).reduce((accu,cur)=>accu+cur, '');
        logger.info(`ngram created  ${this.key}`)
    }
}

module.exports.Ngram = Ngram;