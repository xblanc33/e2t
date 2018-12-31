const MongoClient = require('mongodb').MongoClient;
const winston = require('winston');
const amqp = require('amqplib');
const EntropyCampaignManager = require('./EntropyCampaignManager');

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

class Cartographer {
    constructor(URL, ENTROPY_OPTION) {
        this.mongoUrl = `mongodb://${URL.MONGO}:27017`;
        this.rmqUrl = `amqp://${URL.RABBIT}`;
        
        this.dbName = 'e2t';
        this.expeditionQueue = 'expeditionQueue';
        
        this.ENTROPY_OPTION = ENTROPY_OPTION;
        this.entropyCampaignManagerMap = new Map();
    }

    async start() {
        this.mongoClient = await createConnectedMongoClient(this.mongoUrl);
        this.channel = await createRabbitChannelAndCreateQueue(this.rmqUrl, [this.expeditionQueue]);
        try {
            this.channel.prefetch(1);
            this.channel.consume(this.expeditionQueue, msg => {
                if (msg !== null) {
                    this.handleExpeditionCreation(msg);
                }
            });
        }
        catch (e) {
            logger.error(e.stack);
        }
    }

    handleExpeditionCreation(msg){
        let expedition = JSON.parse(msg.content.toString());
        logger.info(`Received new expedition with id ${expedition.uuid}`);
        let collection = this.mongoClient.db(this.dbName).collection('expedition');
        expedition._id = expedition.expeditionId;
        collection.insertOne(expedition).catch(ex => {
            winston.error(`can't save expedition : ${JSON.stringify(ex)}`);
        });

        let manager = this.entropyCampaignManagerMap.get(expedition.campaignId);
        if (manager === undefined) {
            manager = new EntropyCampaignManager(expedition.campaignId, this.ENTROPY_OPTION);
            this.entropyCampaignManagerMap.set(expedition.campaignId, manager);
        }

        let crossEntropy = manager.crossEntropy(expedition);
        logger.info(`CrossEntropy ${crossEntropy}`);
        manager.updateModel(expedition);

        this.addEntropy(expedition.campaignId, crossEntropy)
            .then( () => {
                logger.info(`Save cross entropy`);
                this.channel.ack(msg);
            })
            .catch( (ex) => {
                logger.error(`exception saving entropy ${JSON.stringify(ex)}`);
                this.channel.nack(msg);
            })
    }

    addEntropy(campaignId, entropyValue){
        return this.mongoClient.db(this.dbName)
            .collection('campaign')
            .updateOne({_id: campaignId}, {$push: {crossentropy: entropyValue}});
    }


}

module.exports = Cartographer;

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

async function createRabbitChannelAndCreateQueue(rmqUrl, queueList) {
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