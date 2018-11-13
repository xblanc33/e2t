const express = require('express');

class RouteExpedition {

    constructor(mongo, dbName, collectionName){
        this.mongo = mongo;
        this.dbName = dbName;
        this.collectionName = collectionName;

        this.add = this.add.bind(this);
        this.list = this.list.bind(this);
    }

    async init(){
        let router = express.Router({ mergeParams: true });  // mergeParams to retrieve parent route params

        router.post('/', this.add);
        router.get('/', this.list);

        return router;
    }

    async add(req, res){
        await res.send(`TODO Add a new expedition in the ${req.params.campaignId} campaign`);
    }

    async list(req, res){
        await res.send(`TODO List all expeditions for the ${req.params.campaignId} campaign`);
    }
}

module.exports = RouteExpedition;