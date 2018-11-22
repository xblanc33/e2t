let Services = require('./Services');
let NavigationListener = require('./NavigationListener');

class Background {
    constructor() {
        this.jwt = null;
        this.campaignId = null;
        this.expedition = {
            events: null
        };

        this.handleMessage = this.handleMessage.bind(this);

        this.navigationListener = new NavigationListener();
    }

    start() {
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }

    handleMessage(msg, sender, sendResponse) {

        switch (msg.kind) {

        case 'getState':
            sendResponse({
                jwt: this.jwt,
                campaignId: this.campaignId,
                expedition: this.expedition
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

        case 'startExpedition':
            this.expedition.events = [];
            this.navigationListener.calibrate();
            break;

        case 'addEventToExpedition':
            chrome.extension.getBackgroundPage().console.log(`Add event : ${msg.event.type}`);
            if(this.expedition.events){
                this.expedition.events.push(msg.event);
            }
            break;

        case 'publishExpedition':
            Services.publishExpedition(this.jwt, this.expedition, msg.campaignId)
                .then(response => {
                    sendResponse(response);
                    this.expedition.events = null;
                })
                .catch(e => {
                    console.error(e.stack);
                    sendResponse(false);
                });
            return true;

        case 'deleteExpedition':
            this.expedition.events = null;
            break;
        }
    }
}

var background = new Background();
background.start();
