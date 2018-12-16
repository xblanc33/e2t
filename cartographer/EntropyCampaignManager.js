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
            probabilitySum = probabilitySum + Math.log2(this.computeProbability(previousEventSeq, nextItem));
        }
        return probabilitySum / expedition.events.length;
    }

    computeProbability(previousEventSeq, nextItem) {
        let ngram = this.ngramMap.get(hashNGram(previousEventSeq));
        if (ngram === undefined) return 0;
        return ngram.getSuccessorProbability(hashItem(nextItem));
    }

    updateModel(expedition) {
        if (expedition.campaignId !== this.campaignId) throw "EntropyCampaignManager received wrong expedition";
        for (let index = 0; index < expedition.events.length; index++) {
            let nextItem = expedition.events[index];
            let previousEventSeq = [];
            if (index > 0) {
                let previousFrom = Math.max(0,index - this.deepth);
                for (let previousIndex = previousFrom; previousIndex < index; previousIndex++) {
                    previousEventSeq[previousIndex-previousFrom] = expedition.events[previousIndex];
                }
            }
            this.updateProbability(previousEventSeq, nextItem);
        }
    }

    updateProbability(previousEventSeq, nextItem) {
        let hashPreviousEventSeq = hashNGram(previousEventSeq);
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
    return hashCode(eventSeq.map( event => {hashItem(event)}).join());
}

function hashCode(s) {
    let h;
    for(let i = 0; i < s.length; i++) 
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;

    return h;
}
