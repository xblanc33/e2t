const express = require('express');
const uuidv4 = require('uuid/v4');

class RouteExpedition {

    constructor(mongoClient, dbName, collectionName, rabbitChannel){
        this.mongoClient = mongoClient;
        this.dbName = dbName;
        this.collectionName = collectionName;
        this.rabbitChannel = rabbitChannel;

        this.createExpedition = this.createExpedition.bind(this);
        this.getExpedition = this.getExpedition.bind(this);
    }

    async init(){
        let router = express.Router({ mergeParams: true });  // mergeParams to retrieve parent route params
        router.post('/', this.createExpedition);
        router.get('/:expeditionId', this.getExpedition);

        return router;
    }

    createExpedition(req, res){
        let expedition = req.body.expedition;
        expedition.uuid = uuidv4();

        this.rabbitChannel.sendToQueue('expeditionQueue'
            , Buffer.from(JSON.stringify(expedition))
            , {}
            , (err,ok) => {
                if (err)  {
                    res.status(500).send(err.message);
                } else {
                    res.status(200).send(expedition);
                }
            });
    }

    getExpedition(req, res){
        let expeditionCollection = this.mongoClient.db(this.dbName).collection(this.collectionName);
        expeditionCollection.findOne({_id: req.params.expeditionId})
        .then( expedition => {
            if (expedition) {
                res.status(200).send(expedition);
            } else {
                res.status(204).send();
            }
        })
        .catch( ex => {
            res.status(500).send(ex.message);
        })
    }
}

module.exports = RouteExpedition;