const express = require('express');
const uuidv4 = require('uuid/v4');

class RouteCampaign {

    constructor(mongoClient, dbName, collectionName){
        this.mongoClient = mongoClient;
        this.dbName = dbName;
        this.collectionName = collectionName;

        this.createCampaign = this.createCampaign.bind(this);
        this.getCampaign = this.getCampaign.bind(this);
    }

    async init(){
        let router = express.Router();

        router.post('/', this.createCampaign);
        router.get('/:campaignId', this.getCampaign);

        return router;
    }

    createCampaign(req, res){
        let uuid = uuidv4();
        let collection = this.mongoClient.db(this.dbName).collection(this.collectionName);

        collection.insertOne({
            _id: uuid,
            uuid : uuid,
            createdAt : new Date(),
            lastUpdate : new Date(),
            expedition : [],
            entropy : []
        })
        .then(document => {
            res.status(201).send({
                campaignId: uuid,
                message: 'Successfully created new campaign'
            });
        })
        .catch( ex => {
            res.status(500).send(JSON.stringify(ex));
        });
    }

    getCampaign(req, res){
        let campaignCollection = this.mongoClient.db(this.dbName).collection(this.collectionName);
        campaignCollection.findOne({_id: req.params.campaignId})
        .then ( campaign => {
            res.status(200).send(campaign);
        })
        .catch( ex => {
            res.status(204).send(JSON.stringify(ex));
        })
    }
}

module.exports = RouteCampaign;