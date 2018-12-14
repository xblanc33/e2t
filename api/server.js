const express = require('express');
const RouteCampaign = require('./RouteCampaign');
const RouteExpedition = require('./RouteExpedition');

const MongoClient = require('mongodb').MongoClient;
const amqp = require('amqplib');

const winston = require('winston');
const logger = winston.createLogger({
    level: 'debug',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'e2t';
const RABBIT_URL = 'amqp://localhost';
const QUEUES_LIST = ['expeditionQueue'];

(async() => {
    let mongoClient = await createConnectedMongoClient(MONGO_URL);
    let rabbitChannel = await initRabbit(RABBIT_URL, QUEUES_LIST);

    let app = express();
    app.use(express.json());

    app.use('/campaign', await new RouteCampaign(mongoClient, DB_NAME, 'campaign').init());
    app.use('/expedition', await new RouteExpedition(mongoClient, DB_NAME, 'expedition', rabbitChannel).init());

    app.listen(3000, logger.info('E2T api listening on port 3000'));
})();


async function createConnectedMongoClient(mongoUrl) {
    logger.info("Waiting for MongoDB...");
    let mongoClient = null;
    while (!mongoClient) {
        try {
            mongoClient = await MongoClient.connect(mongoUrl, { useNewUrlParser: true });
        }
        catch (e) {  //TODO Catch a lower exception, so that we don't miss an important one...
            logger.debug(e.stack);
            await new Promise((resolve, _) => setTimeout(resolve, 5000));
        }
    }
    logger.info("Successfully connected to MongoDB");
    return mongoClient;
}

/**
 * Wait for rabbit to be available, initiate connection and create queues if needed
 * @param {string} rmqUrl
 * @param {string[]} queuesList 
 */
async function initRabbit(rmqUrl, queueList) {
    logger.info("Waiting for RabbitMQ...");
    let channel = null;
    while (!channel) {
        try {
            let amqpConnection = await amqp.connect(rmqUrl);
            channel = await amqpConnection.createConfirmChannel();
            for (let queuName of queueList) {
                await channel.assertQueue(queuName, { arguments: { "x-queue-mode": "lazy" } });
            }
        }
        catch (e) {  //TODO Catch a lower exception, so that we don't miss an important one...
            logger.debug(e.stack);
            await new Promise((resolve, _) => setTimeout(resolve, 5000));
        }
    }
    logger.info("Successfully connected to RabbitMQ");
    return channel;
}
