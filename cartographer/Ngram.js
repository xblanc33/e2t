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
    constructor(hash) {
        if (!hash) throw new Error('cannnot create a Ngram without a hash');
        this.hash = hash;
        this.successorMap = new Map();
        this.size = 0;
        logger.info(`A new Ngram has been created`);
    }

    getSuccessorProbability(eventHash) {
        let probability;
        let occurence = this.successorMap.get(eventHash);
        if (occurence === undefined) probability = 0;
        if (occurence !== undefined) probability = occurence / this.size;
        logger.info(`Probability for ${eventHash} is ${probability}`);
        return probability;
    }

    updateSuccessorOccurence(eventHash) {
        let occurence = this.successorMap.get(eventHash);
        occurence === undefined ? occurence = 1 : occurence++ ;
        this.successorMap.set(eventHash, occurence);
        this.size++;
        logger.info(`Update model for ${eventHash} with ${occurence} / ${this.size}`);
    }
}

module.exports = Ngram;