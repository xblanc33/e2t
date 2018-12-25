let axios = require('axios');

class Services {
    constructor(){}

    static createCampaign(){
        console.log('Service: createCampaign');
        return axios.post(`${BASE_URL}/api/campaign`, {})
    }

    static joinCampaign(campaignId){
        return axios.get(`${BASE_URL}/api/campaign/${campaignId}`, {});
    }

    static publishExpedition(expedition){
        return axios.post(`${BASE_URL}/api/expedition`, {expedition: expedition});
    }

    static async getEntropies(jwt, campaignId){  // TODO Check how do we represent entropy ? This may not be related to expedition but to campaign
        let response = await axios.get(`${BASE_URL}/api/campaign/${campaignId}/entropy`, {headers: {'Authorization': `Bearer ${jwt}`}})
            .catch(e => console.error(e.stack));
        return response.data;
    }
}

module.exports = Services;