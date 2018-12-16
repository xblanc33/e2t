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
    constructor() {
        this.mongoUrl = `mongodb://mongo:27017`;
        this.dbName = 'e2t';
        this.expeditionQueue = 'expeditionQueue';
    }

    async start() {
        let mongo = await MongoClient.connect(this.mongoUrl, { useNewUrlParser: true });
        this.expeditionCollection = mongo.db(this.dbName).collection("expedition");
        this.campaignCollection = mongo.db(this.dbName).collection('campaign');

        this.channel = await initRabbit(this.rmqUrl = `amqp://rabbit`, [this.expeditionQueue]);
        try {
            this.channel.prefetch(1);
            this.channel.consume(this.expeditionQueue, async msg => {
                if (msg !== null) {
                    await this.performJob(msg);
                }
            });
        }
        catch (e) {
            logger.error(e.stack);
        }
    }

    async performJob(msg){

        let limit = 20;  // Number of expeditions that you want to retrieve from the db in order to do the entropy calculation

        let expedition = JSON.parse(msg.content.toString());
        logger.info(`Received expedition id ${expedition._id}`);

        let expeditions = await this.getExpeditions(expedition.campaignId, limit);

        ///////////////////
        let entropyValue = Math.round(Math.random()*100);  // Here, perform the entropy calculation
        ///////////////////

        await this.addEntropy(expedition.campaignId, entropyValue);
        await this.setEntropy(expedition._id, entropyValue);
        
        this.channel.ack(msg);
        logger.info(`Set expedition ${expedition._id} with value ${entropyValue}`);
    }

    async getExpeditions(campaignId, limit) {
        let expeditions = await this.expeditionCollection
            .find({ campaignId: campaignId })
            .sort({ _id: 1 })  // TODO Check that for the last n, it is not -1 instead of 1
            .limit(limit)
            .toArray();
        return expeditions;
    }

    async addEntropy(campaignId, entropyValue){
        await this.campaignCollection.updateOne({_id: new ObjectId(campaignId)}, {$push: {entropyValues: entropyValue}});
    }

    async setEntropy(expeditionId, entropyValue) {
        await this.expeditionCollection.updateOne(
            { _id: ObjectId(expeditionId) }, {
                $set: {
                    entropyValue: entropyValue
                }
            });
    }

}

module.exports = Calculator;

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
            console.error(e.stack);
            logger.debug(e.stack);
            await new Promise((resolve, _) => setTimeout(resolve, 5000));
        }
    }
    logger.info("Successfully connected to RabbitMQ");
    return channel;
}