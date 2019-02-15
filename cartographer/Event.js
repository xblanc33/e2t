const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

class Event {
    constructor(value) {
        if (value === null || value === undefined) {
            throw 'Cannot create Element with null or undefined';
        }
        this.key = hashCode(value).toString();
        this.value = value;
        logger.info(`Event created ${this.key}`);
    }
}

function hashCode(s) {
    if (s === undefined || s === null) throw 'cannot hash undefined / null';
    let hash = 0, i, chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

module.exports.Event = Event;