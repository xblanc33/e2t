const MongoClient = require('mongodb').MongoClient;
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

class EntropyCampaignManager {
    constructor(campaignId) {
        this.campaignId = campaignId;
    }

    updateEntropy(exploration) {
    }


}

module.exports = EntropyCampaignManager;
