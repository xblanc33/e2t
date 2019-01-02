const winston = require('winston');
const Ngram = require('./Ngram');
const hashNGram = require('./hash').hashNGram;
const hashItem = require('./hash').hashItem;

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

class EntropyCampaignManager {
    constructor(campaign) {
        if (!campaign) throw new Error('EntropyCampaignManager should be created with a campaign');
        this.campaignId = campaign.campaignId;
        this.DEPTH = campaign.depth;
        this.PROBA_OF_UNKNOWN = campaign.probaOfUnknown;
        logger.info(`Campaign manager with depth=${this.DEPTH} and proba=${this.PROBA_OF_UNKNOWN}`);
        this.ngramMap = new Map();
    }

    crossEntropy(expedition) {
        if (expedition.campaignId !== this.campaignId) throw "EntropyCampaignManager received wrong expedition";
        let probabilitySum = 0;
        for (let index = 0; index < expedition.events.length; index++) {
            let nextItem = expedition.events[index];
            let previousEventSeq = this.createPreviousEventSeq(expedition.events, index, this.DEPTH);
            probabilitySum = probabilitySum + Math.log2(this.computeProbability(previousEventSeq, nextItem));
        }
        return -(probabilitySum / expedition.events.length);
    }

    createPreviousEventSeq(eventSet, index, depth) {
        let previousEventSeq = [];
        if (index > 0) {
            let previousFrom = Math.max(0,index - depth);
            for (let previousIndex = previousFrom; previousIndex < index; previousIndex++) {
                previousEventSeq.push(eventSet[previousIndex]);
            }
        }
        return previousEventSeq;
    }

    computeProbability(previousEventSeq, nextItem) {
        let ngram = this.ngramMap.get(hashNGram(previousEventSeq));
        if (ngram === undefined) return this.PROBA_OF_UNKNOWN;
        let proba = ngram.getSuccessorProbability(hashItem(nextItem));
        return proba !== 0 ? proba * (1-this.PROBA_OF_UNKNOWN) : this.PROBA_OF_UNKNOWN;
    }

    updateModel(expedition) {
        if (expedition.campaignId !== this.campaignId) throw "EntropyCampaignManager received wrong expedition";
        logger.info(`update model with expedition ${JSON.stringify(expedition.events)}`)
        for (let index = 0; index < expedition.events.length; index++) {
            let nextItem = expedition.events[index];
            let previousEventSeq = this.createPreviousEventSeq(expedition.events, index, this.DEPTH);
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
