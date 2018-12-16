const MongoClient = require('mongodb').MongoClient;
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
                    previousEventSeq[previousIndex-previousFrom] = expedition.events[previousIndex];
                }
            }
            probabilitySum = probabilitySum + Math.log2(computeProbability(previousEventSeq, nextItem));
        }
        return probabilitySum / expedition.events.length;
    }

    computeProbability(previousEventSeq, nextItem) {
        let ngram = ngramMap.get(hashNGram(previousEventSeq));
        if (ngram === undefined) return 0;
        return ngram.getSuccessorProbability(hashItem(nextItem));
    }

    updateModel(exploration) {
        if (expedition.campaignId !== this.campaignId) throw "EntropyCampaignManager received wrong exploration";
        for (let index = 0; index < exploration.events.length; index++) {
            let previousFrom = Math.max(0,index - this.deepth);
            let ngram = [];
            if (index > 0) {
                for (let previousIndex = previousFrom; previousIndex < index; previousIndex++) {
                    ngram[previousIndex-previousFrom] = exploration.events[previousIndex];
                }
            }
            probabilitySum = probabilitySum + Math.log2(computeProbability(exploration.events[index],ngram));
        }
        return probabilitySum / exploration.events.length;
    }

    updateProbability(previousEventSeq, nextItem) {
        let hashPreviousEventSeq = hashNGram(previousEventSeq);
        let ngram = ngramMap.get(hashPreviousEventSeq);
        if (ngram === undefined) {
            ngram = new Ngram(hashPreviousEventSeq);
            ngramMap.set(hashPreviousEventSeq, ngram);
        }
        ngram.updateSuccessorOccurence(hashItem(nextItem));
    }

    hashItem(event) {
        return hashCode(event.type+event.selector);
    }

    hashNGram(eventSeq) {
        return hashCode(eventSeq.map( event => {hashItem(event)}).join());
    }
}

module.exports = EntropyCampaignManager;

function hashCode(s) {
    let h;
    for(let i = 0; i < s.length; i++) 
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;

    return h;
}
