let Services = require('./Services');
let NavigationListener = require('./NavigationListener');

class Background {
    constructor() {
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
                campaignId: this.campaignId,
                expedition: this.expedition
            });
            return true;

        case 'createCampaign':
            //console.log('Background: createCampaign');        
            Services.createCampaign()
                .then(response => {
                    //console.log('Backgournd: send response');
                    sendResponse(response.data);
                    this.campaignId = response.data.campaignId;
                })
                .catch(e => {
                    //console.error(e.stack);
                    sendResponse(false);
                });
            return true;

        case 'joinCampaign':
            Services.joinCampaign(msg.campaignId)
                .then(response => {
                    sendResponse(response.data);
                    this.campaignId = response.data.campaignId;
                })
                .catch(e => {
                    //console.error(e.stack);
                    sendResponse(false);
                });
            return true;

        case 'startExpedition':
            this.expedition.campaignId = this.campaignId;
            this.expedition.events = [];
            this.navigationListener.calibrate();
            break;

        case 'addEventToExpedition':
            chrome.extension.getBackgroundPage().console.log(`Add event : ${msg.event.type}`);
            if(this.expedition.events){
                this.expedition.events.push(msg.event);
            }
            break;

        case 'publishExpedition':  // TODO Add url to the expedition object
            Services.publishExpedition(this.expedition)
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

        case 'getEntropies':
            Services.getEntropies(this.jwt, msg.campaignId)
                .then(response => {
                    sendResponse(response);
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
