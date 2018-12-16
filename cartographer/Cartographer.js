const MongoClient = require('mongodb').MongoClient;
const winston = require('winston');
const amqp = require('amqplib');
const {ObjectId} = require('mongodb');

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console(),],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
});

class Cartographer {
    constructor(URL) {
        this.mongoUrl = `mongodb://${MONGO.URL}:27017`;
        this.rmqUrl = `amqp://${URL.RABBIT}`
        this.dbName = 'e2t';
        this.expeditionQueue = 'expeditionQueue';
        this.entropyCampaignManagerMap = new Map();
    }

    async start() {
        this.mongoClient = await createConnectedMongoClient(this.mongoUrl);
        this.channel = await createRabbitChannelAndCreateQueue(this.rmqUrl, [this.expeditionQueue]);
        try {
            this.channel.prefetch(1);
            this.channel.consume(this.expeditionQueue, msg => {
                if (msg !== null) {
                    let expedition = JSON.parse(msg.content.toString());
                    this.handleExpeditionCreation(expedition);
                }
            });
        }
        catch (e) {
            logger.error(e.stack);
        }
    }

    handleExpeditionCreation(expedition){
        logger.info(`Received new expedition with id ${expedition.uuid}`);
        let collection = this.mongoClient.db(this.dbName).collection('expedition');
        expedition._id = expedition.uuid;
        collection.insertOne(expedition);

        let manager = this.entropyCampaignManagerMap.get(expedition.campaignId);
        if (manager === undefined) {
            manager = new entropyCampaignManager(expedition.campaignId);
            this.entropyCampaignManagerMap.set(expedition.campaignId, manager);
        }

        let crossEntropy = manager.crossEntropy(expedition);
        manager.updateModel(expedition);

        await this.addEntropy(expedition.campaignId, entropyValue);
        await this.setEntropy(expedition._id, entropyValue);
        
        this.channel.ack(msg);
        logger.info(`Set expedition ${expedition._id} with value ${entropyValue}`);
    }

    async addEntropy(campaignId, entropyValue){
        await this.campaignCollection.updateOne({_id: new ObjectId(campaignId)}, {$push: {entropyValues: entropyValue}});
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