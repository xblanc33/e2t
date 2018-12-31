let axios = require('axios');

class Services {
    constructor(){}

    static createCampaign(options){
        console.log('Service: createCampaign');
        return axios.post(`${BASE_URL}/api/campaign`, {options:options})
    }

    static joinCampaign(campaignId){
        return axios.get(`${BASE_URL}/api/campaign/${campaignId}`);
    }

    static publishExpedition(expedition){
        return axios.post(`${BASE_URL}/api/expedition`, {expedition: expedition});
    }
}

module.exports = Services;