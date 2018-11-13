const express = require('express');

class RouteCampaign {

    constructor(mongo, dbName, collectionName){
        this.mongo = mongo;
        this.dbName = dbName;
        this.collectionName = collectionName;

        this.create = this.create.bind(this);
        this.list = this.list.bind(this);
        this.join = this.join.bind(this);
    }

    async init(){
        let router = express.Router();

        router.post('/', this.create);
        router.get('/', this.list);  // TODO Can a user lists all campaigns or only those he participates in ?
        
        router.put('/:campaignId', this.join);  // PUT method here because we join the campaign

        return router;
    }

    async create(req, res){
        await res.send('TODO Create a new campaign');
    }

    async list(req, res){
        await res.send('TODO List all campaigns');
    }

    async join(req, res){
        await res.send('TODO Join a campaign with the campaignId');
    }
}

module.exports = RouteCampaign;