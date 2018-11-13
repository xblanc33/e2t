let axios = require('axios');

class Services {
    constructor(){}

    static async signin(credentials){
        let response = await axios.post(`${BASE_URL}/authenticate/session`, credentials);
        return response.status===200 ? response.data : {
            message: 'Signin api failure',
            jwt: null
        };
    }

    static async signup(credentials){
        chrome.extension.getBackgroundPage().console.log(`Gonna call signup api at url ${BASE_URL}/authenticate/user from services.js with credentials ${JSON.stringify(credentials)}`);
        let response = await axios.post(`${BASE_URL}/authenticate/user`, credentials);
        chrome.extension.getBackgroundPage().console.log(`Services signup response : ${response}`);
        return response.status===200 ? response.data : {
            message: 'Signup api failure'
        };
    }
}

module.exports = Services;