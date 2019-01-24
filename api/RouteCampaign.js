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
        this.joinCampaign = this.joinCampaign.bind(this);
    }

    async init(){
        let router = express.Router();

        router.post('/', this.createCampaign);
        router.get('/:campaignId', this.getCampaign);
        router.put('/:campaignId', this.joinCampaign);

        return router;
    }

    createCampaign(req, res){
        let uuid = uuidv4();
        let options = req.body.options;

        let depth = Number.parseInt(properties.path().cartographer.depth);
        let optionDepth = Number.parseInt(options.depth);
        if (!isNaN(optionDepth)) {
            if (optionDepth >=2 && optionDepth <= 8 ) {
                depth = optionDepth;
            }
        }
        
        let probaOfUnknown = Number.parseFloat(properties.path().cartographer.proba_of_unknown);
        let optionsProba = Number.parseFloat(options.proba);
        if (!isNaN(optionsProba)) {
            if (optionsProba < 1) {
                probaOfUnknown = optionsProba;
            }
        }

        let campaign = {
            _id: uuid,
            campaignId : uuid,
            createdAt : new Date(),
            lastUpdate : new Date(),
            depth : depth,
            probaOfUnknown : probaOfUnknown,
            profiles: [],
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
            });
    }

    joinCampaign(req, res) {
        let campaignCollection = this.mongoClient.db(this.dbName).collection(this.collectionName);
        let userId = uuidv4();
        campaignCollection.findOneAndUpdate(
                { _id: req.params.campaignId },
                { $push: { profiles: userId } },
                { returnOriginal: false }
            )
            .then(data => {
                if (data.value) {
                    res.status(200).send({
                        campaign: data.value,  // TODO Check that mongoDB correctly returns the updated campaign
                        userId: userId
                    });
                } else {
                    res.status(204).send();
                }
            })
            .catch(ex => {
                console.error(ex.message);
                res.status(500).send(ex.message);
            });
    }
}

module.exports = RouteCampaign;