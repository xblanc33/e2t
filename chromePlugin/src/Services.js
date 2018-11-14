let axios = require('axios');

class Services {
    constructor(){}

    static async signin(credentials){
        let response = await axios.post(`${BASE_URL}/authenticate/session`, credentials)
            .catch(e => e.reponse);
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
}

module.exports = Services;