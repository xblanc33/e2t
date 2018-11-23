let axios = require('axios');

class Services {
    constructor(){}

    static async signin(credentials){
        let response = await axios.post(`${BASE_URL}/authenticate/session`, credentials)
            .catch(e => {console.error(e.stack); return e.reponse;});
        return response.data;
    }

    static async signup(credentials){
        let response = await axios.post(`${BASE_URL}/authenticate/user`, credentials)
            .catch(e => {
                if(e.response.status == 409){  // User already exists
                    return e.response;
                }
                else{
                    console.error(e.stack);
                }
            });
        return response.data;
    }

    static async createCampaign(jwt){
        let response = await axios.post(`${BASE_URL}/campaign`, {}, {headers: {'Authorization': `Bearer ${jwt}`}})
            .catch(e => console.error(e.stack));
        return response.data;
    }

    static async joinCampaign(jwt, campaignId){
        let response = await axios.put(`${BASE_URL}/campaign/${campaignId}`, {}, {headers: {'Authorization': `Bearer ${jwt}`}})
            .catch(e => console.error(e.stack));
        return response.data;
    }

    static async publishExpedition(jwt, expedition, campaignId){
        let response = await axios.post(`${BASE_URL}/campaign/${campaignId}/expedition`, {
            events: expedition.events
        }, {headers: {'Authorization': `Bearer ${jwt}`}})
            .catch(e => console.error(e.stack));
        return response.data;
    }

    static async getEntropies(jwt, campaignId){  // TODO Check how do we represent entropy ? This may not be related to expedition but to campaign
        let response = await axios.get(`${BASE_URL}/campaign/${campaignId}/entropy`, {headers: {'Authorization': `Bearer ${jwt}`}})
            .catch(e => console.error(e.stack));
        return response.data;
    }
}

module.exports = Services;