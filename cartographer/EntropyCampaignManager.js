const winston = require('winston');
const Ngram = require('./Ngram');

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

class EntropyCampaignManager {
    constructor(campaignId, deepth) {
        this.campaignId = campaignId;
        this.deepth = deepth;
        this.ngramMap = new Map();
    }

    crossEntropy(expedition) {
        if (expedition.campaignId !== this.campaignId) throw "EntropyCampaignManager received wrong expedition";
        let probabilitySum = 0;
        for (let index = 0; index < expedition.events.length; index++) {
            let nextItem = expedition.events[index];
            let previousEventSeq = [];
            if (index > 0) {
                let previousFrom = Math.max(0,index - this.deepth);
                for (let previousIndex = previousFrom; previousIndex < index; previousIndex++) {
                    previousEventSeq.push(expedition.events[previousIndex]);
                }
            }
            probabilitySum = probabilitySum + Math.log2(this.computeProbability(previousEventSeq, nextItem));
        }
        return -(probabilitySum / expedition.events.length);
    }

    computeProbability(previousEventSeq, nextItem) {
        let ngram = this.ngramMap.get(hashNGram(previousEventSeq));
        if (ngram === undefined) return 0;
        return ngram.getSuccessorProbability(hashItem(nextItem));
    }

    updateModel(expedition) {
        if (expedition.campaignId !== this.campaignId) throw "EntropyCampaignManager received wrong expedition";
        logger.info(`update model with expedition ${JSON.stringify(expedition.events)}`)
        for (let index = 0; index < expedition.events.length; index++) {
            let nextItem = expedition.events[index];
            let previousEventSeq = [];
            if (index > 0) {
                let previousFrom = Math.max(0,index - this.deepth);
                for (let previousIndex = previousFrom; previousIndex < index; previousIndex++) {
                    previousEventSeq.push(expedition.events[previousIndex]);
                }
            }
            this.updateProbability(previousEventSeq, nextItem);
        }
    }

    updateProbability(previousEventSeq, nextItem) {
        logger.info(`update ${JSON.stringify(previousEventSeq)} and ${JSON.stringify(nextItem)}`)
        let hashPreviousEventSeq = hashNGram(previousEventSeq);
        logger.info(`hashPreviousEventSeq: ${hashPreviousEventSeq}`);
        let ngram = this.ngramMap.get(hashPreviousEventSeq);
        if (ngram === undefined) {
            ngram = new Ngram(hashPreviousEventSeq);
            this.ngramMap.set(hashPreviousEventSeq, ngram);
        }
        ngram.updateSuccessorOccurence(hashItem(nextItem));
    }
}

module.exports = EntropyCampaignManager;

function hashItem(event) {
    return hashCode(event.type+event.selector);
}

function hashNGram(eventSeq) {
    return hashCode(eventSeq.map( event => {
        return event.type+event.selector;
    }).join(','));
}

function hashCode(s) {
    let hash = 0, i, chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
      chr   = s.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };