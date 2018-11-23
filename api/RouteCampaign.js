const express = require('express');
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;

class RouteCampaign {

    constructor(mongo, dbName, collectionName){
        this.mongo = mongo;
        this.dbName = dbName;
        this.collectionName = collectionName;

        this.create = this.create.bind(this);
        this.list = this.list.bind(this);
        this.join = this.join.bind(this);
        this.getEntropies = this.getEntropies.bind(this);
    }

    async init(){
        let router = express.Router();
        router.use(passport.authenticate('jwt', {failureRedirect: '/login' , session:false}));  //TODO Redirect should be taken into account by the React routes

        router.post('/', this.create);
        router.get('/', this.list);  // TODO Can a user lists all campaigns or only those he participates in ?
        
        router.put('/:campaignId', this.join);  // PUT method here because we join the campaign
        router.get('/:campaignId/entropy', this.getEntropies);

        return router;
    }

    async create(req, res){
        let collection = this.mongo.db(this.dbName).collection(this.collectionName);
        let explorator = req.user;

        let id = new ObjectID();
        await collection.insertOne({
            _id: id,
            explorators: [explorator.username],
            entropyValues: []
        });

        res.send({
            campaignId: id,
            message: 'Successfully created new campaign'
        });
    }

    async list(req, res){
        let collection = this.mongo.db(this.dbName).collection(this.collectionName);
        let explorator = req.user;

        let campaigns = await collection.find({explorators: explorator.username}).toArray();
        let campaignIds = campaigns.map(c => c._id);

        await res.send({
            campaignsIds: campaignIds,
            message: "Successfully retrieved campaigns"
        });
    }

    async join(req, res){
        let collection = this.mongo.db(this.dbName).collection(this.collectionName);
        let explorator = req.user;

        if(req.params.campaignId.length != 24){
            res.send({message: "campaignId should be 24 chars long"});
        }

        let mongoFilter = {_id: new ObjectID(req.params.campaignId)};

        let campaign = await collection.findOne(mongoFilter);
        if(!campaign){
            res.send({
                campaignId: null,
                message: `The campaign with id ${req.params.campaignId} doesn't exist`
            });
        }
        else if(campaign.explorators.includes(explorator.username)){
            res.send({
                campaignId: campaign._id,
                message: 'You already joined this campaign'
            });
        }
        else{
            await collection.updateOne(mongoFilter, {$push: {explorators: explorator.username}});
            res.send({
                campaignId: campaign._id,
                message : 'Successfully joined the campaign'
            });
        }
    }

    async getEntropies(req, res){
        let campaignCollection = this.mongo.db(this.dbName).collection('campaign');
        let expeditionCollection = this.mongo.db(this.dbName).collection('expedition');
        let explorator = req.user;
        let campaign = await campaignCollection.findOne({_id: new ObjectID(req.params.campaignId)});

        if(campaign && campaign.explorators.includes(explorator.username)){
            let expeditions = await expeditionCollection.find({campaignId: new ObjectID(req.params.campaignId)}).toArray();
            let entropyValues = expeditions.map(expedition => expedition.entropyValue);
            res.send({
                entropyValues: entropyValues,
                message: 'Successfully retrieved entropyValues'
            });
        }
        else{
            res.send({
                entropyValues: [],
                message: 'Campaign doesn\'t exist or you didn\'t join it'
            });
        }
    }
}

module.exports = RouteCampaign;