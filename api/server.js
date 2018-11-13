const express = require('express');
const RouteCampaign = require('./RouteCampaign');
const RouteExpedition = require('./RouteExpedition');
const RouteAuthenticate = require('./RouteAuthenticate');

const MongoClient = require('mongodb').MongoClient;

const winston = require('winston');

const logger = winston.createLogger({
    level: 'debug',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

const MONGO_URL = 'mongodb://mongo:27017';
const DB_NAME = 'e2t';

(async() => {
    let mongo = await initMongo(MONGO_URL);

    let app = express();

    app.use('/campaign', await new RouteCampaign(mongo, DB_NAME, 'campaign').init());
    app.use('/campaign/:campaignId/expedition', await new RouteExpedition(mongo, DB_NAME, 'expedition').init());
    app.use('/authenticate', await new RouteAuthenticate(mongo, DB_NAME, 'authenticate').init());

    app.listen(3000, logger.info('E2T api listening on port 3000'));
})();

/**
 * Wait for mongo to be available and initiate the connexion
 */
async function initMongo(mongoUrl) {
    logger.info("Waiting for MongoDB...");
    let mongo = null;
    while (!mongo) {
        try {
            mongo = await MongoClient.connect(mongoUrl, { useNewUrlParser: true });
        }
        catch (e) {  //TODO Catch a lower exception, so that we don't miss an important one...
            logger.debug(e.stack);
            await new Promise((resolve, _) => setTimeout(resolve, 5000));
        }
    }
    logger.info("Successfully connected to MongoDB");
    return mongo;
}