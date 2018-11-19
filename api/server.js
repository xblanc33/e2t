const express = require('express');
const RouteCampaign = require('./RouteCampaign');
const RouteExpedition = require('./RouteExpedition');
const RouteAuthenticate = require('./RouteAuthenticate');

const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;  //TODO Check if there is a cleaner way of writing this
const ExtractJwt = passportJWT.ExtractJwt;

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

const MONGO_URL = 'mongodb://mongo:27017';
const DB_NAME = 'e2t';
const RABBIT_URL = 'amqp://rabbit';
const QUEUES_LIST = ['expeditionQueue'];

(async() => {
    let mongo = await initMongo(MONGO_URL);
    let rabbitChannel = await initRabbit(RABBIT_URL, QUEUES_LIST);

    let app = express();
    app.use(passport.initialize());
    await setJWTStrategy(mongo);
    app.use(express.json());

    app.use('/campaign', await new RouteCampaign(mongo, DB_NAME, 'campaign').init());
    app.use('/campaign/:campaignId/expedition', await new RouteExpedition(mongo, DB_NAME, 'expedition', rabbitChannel).init());
    app.use('/authenticate', await new RouteAuthenticate(mongo, DB_NAME, 'authenticate').init());

    app.listen(3000, logger.info('E2T api listening on port 3000'));
})();

async function setJWTStrategy(mongo) {
    let jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };

    var strategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {

        let collection = mongo.db(DB_NAME).collection('authenticate');
        let user = await collection.findOne({username:jwtPayload.username})
            .catch(e => done(e.stack));
        if (user) {
            return done(null, user);
        } else {
            logger.info('user not found');
            return done(null, false, {message:'Incorrect Login/Password'});
        }
    });
    
    passport.use(strategy);
}

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
