const Sequence = require('./Sequence.js').Sequence;
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

const PROBA_OF_UNKNOWN = 0;//0.000001;
const DEPTH = 3;

class NaturalnessModel {
    constructor(depth, probaOfUnknown) {
        this.ngramMap = new Map();
        this.depth = depth || DEPTH;
        this.probaOfUnknown = probaOfUnknown || PROBA_OF_UNKNOWN;
        logger.info(`NaturalnessModel created (depth=${this.depth}, probaOfUnknown=${this.probaOfUnknown})`);
    }

    crossEntropy(sequence) {
        checkSequenceType(sequence);
        if (sequence.eventList.length === 0) return this.probaOfUnknown;
        let probabilitySum = 0;
        for (let index = 0; index < sequence.eventList.length; index++) {
            let currentElement = sequence.eventList[index];
            let currentNgram = sequence.getNgram(index, this.depth);
            let modelProba = this.getProbability(currentNgram, currentElement);
            let proba;
            if (modelProba === 0) {
                proba = this.probaOfUnknown;
            } else {
                proba = modelProba * (1-this.probaOfUnknown)
            }
            probabilitySum = probabilitySum + Math.log2(proba);
        }
        logger.info(`NaturalnessModel crossEntropy (${-(probabilitySum / sequence.eventList.length)}`);
        return -(probabilitySum / sequence.eventList.length);
    }

    learn(sequence) {
        checkSequenceType(sequence);
        for (let index = 0; index < sequence.eventList.length; index++) {
            let ngram = sequence.getNgram(index,this.depth);
            let ngramSuccessor = this.ngramMap.get(ngram.key);
            if (ngramSuccessor === undefined) {
                ngramSuccessor = {};
                ngramSuccessor[`${sequence.eventList[index].key}`] = 0;
                ngramSuccessor.cardinality = 0;
            }
            let oldOccurence = ngramSuccessor[`${sequence.eventList[index].key}`]
            if (isNaN(oldOccurence)) {
                ngramSuccessor[`${sequence.eventList[index].key}`] = 1;
            } else {
                ngramSuccessor[`${sequence.eventList[index].key}`]++;
            }
            ngramSuccessor.cardinality = ngramSuccessor.cardinality + 1;
            this.ngramMap.set(ngram.key, ngramSuccessor);
            logger.info(`NaturalnessModel learn`);
        }
    }

    getProbability(ngram, element) {
        let ngramSuccessor = this.ngramMap.get(ngram.key);
        if (ngramSuccessor === undefined) {
            return 0;
        }
        
        let elementModelProba = ngramSuccessor[`${element.key}`];
        if (elementModelProba === undefined || elementModelProba === null) {
            return 0;
        }

        let proba = elementModelProba / ngramSuccessor.cardinality;
        return proba;
    }

    getKnownProbability(ngram) {
        
    }
}

function checkSequenceType(sequence) {
    if (!(sequence instanceof Sequence)) {
        throw 'sequence is not a Sequence';
    }
}

module.exports.NaturalnessModel = NaturalnessModel;