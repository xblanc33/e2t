let axios = require('axios');

class Services {
    constructor(){}

    static createAndJoinCampaign(options){
        return axios.post(`${BASE_URL}/api/campaign`, {options:options})
            .then(response => {
                if(response.status === 201){
                    return Promise.resolve(Services.joinCampaign(response.data.campaignId));
                }
                else {
                    return Promise.resolve(response);
                }
            });
    }

    static joinCampaign(campaignId){
        return axios.put(`${BASE_URL}/api/campaign/${campaignId}`);
    }

    static getCampaign(campaignId){
        return axios.get(`${BASE_URL}/api/campaign/${campaignId}`);
    }

    static publishExpedition(expedition){
        return axios.post(`${BASE_URL}/api/expedition`, {expedition: expedition});
    }
}

module.exports = Services;