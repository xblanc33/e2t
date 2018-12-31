const express = require('express');
const uuidv4 = require('uuid/v4');

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('e2t.properties');


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
        let options = req.body.options;

        let depth = properties.path().cartographer.depth;
        if (options.depth !== "" && Number.isInteger(options.depth)) {
            if (options.depth >=2 && options.depth <= 8 ) {
                depth = Number.parseInt(options.depth);
            }
        }
        
        let probaOfUnknown = properties.path().cartographer.proba_of_unknown;
        if (options.proba !== "" && ! Number.isNaN(options.proba)) {
            if (options.proba < 1 && Number.isInteger(options.proba*100)) {
                probaOfUnknown = Number.parseFloat(options.proba);
            }
        }

        let campaign = {
            _id: uuid,
            campaignId : uuid,
            createdAt : new Date(),
            lastUpdate : new Date(),
            depth : depth,
            probaOfUnknown : probaOfUnknown,
            expedition : [],
            crossentropy : []
        };
        let collection = this.mongoClient.db(this.dbName).collection(this.collectionName);

        collection.insertOne(campaign)
        .then(result => {
            res.status(201).send(campaign);
        })
        .catch( ex => {
            res.status(500).send(ex.message);
        });
    }

    getCampaign(req, res){
        let campaignCollection = this.mongoClient.db(this.dbName).collection(this.collectionName);
        campaignCollection.findOne({_id: req.params.campaignId})
        .then ( campaign => {
            if (campaign === undefined || campaign === null)  {
                res.status(204).send();
            } else {
                res.status(200).send(campaign);
            }
        })
        .catch( ex => {
            res.status(500).send(ex.message);
        })
    }
}

module.exports = RouteCampaign;