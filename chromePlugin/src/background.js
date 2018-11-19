let Services = require('./Services');


class Background {
    constructor() {
        this.jwt = null;
        this.campaignId = null;

        this.handleMessage = this.handleMessage.bind(this);
    }

    start() {
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }

    handleMessage(msg, sender, sendResponse) {  //TODO There should be a way to remove code there
        switch (msg.kind) {

        case 'getState':
            sendResponse({
                jwt: this.jwt,
                campaignId: this.campaignId
            });
            return true;

        case 'signIn':
            Services.signin(msg.credentials)
                .then(response => {
                    sendResponse(response);
                    this.jwt = response.jwt;
                })
                .catch(e => {
                    console.error(e.stack);
                    sendResponse(false);
                });
            return true;

        case 'signUp':
            Services.signup(msg.credentials)
                .then(response => sendResponse(response))
                .catch(e => {
                    console.error(e.stack);
                    sendResponse(false);
                });
            return true;

        case 'createCampaign':
            Services.createCampaign(this.jwt)
                .then(response => {
                    sendResponse(response);
                    this.campaignId = response.campaignId;
                })
                .catch(e => {
                    console.error(e.stack);
                    sendResponse(false);
                });
            return true;

        case 'joinCampaign':
            Services.joinCampaign(this.jwt, msg.campaignId)
                .then(response => {
                    sendResponse(response);
                    this.campaignId = response.campaignId;
                })
                .catch(e => {
                    console.error(e.stack);
                    sendResponse(false);
                });
            return true;
        }

    }
}

var background = new Background();
background.start();
