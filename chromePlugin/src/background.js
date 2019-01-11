let Services = require('./Services');
let NavigationListener = require('./NavigationListener');

class Background {
    constructor() {
        this.initialize();

        this.handleMessage = this.handleMessage.bind(this);
        this.navigationListener = new NavigationListener();
    }

    initialize() {
        this.state = {
            mappedToCampaign : false,
            windowId : undefined,
            isRecording : false,
            campaignId : undefined,
            expedition : {
                campaignId: undefined,
                events: []
            },
            message : `Plugin was just initialized`
        };
    }

    start() {
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }

    handleMessage(msg, sender, sendResponse) {
        switch (msg.kind) {
            case 'initialize':
                this.initialize();
                sendResponse(this.state);
                return true;

            case 'setWindow':
                this.state.windowId = msg.windowId;
                sendResponse(this.windowId);
                return true;

            case 'getState':
                sendResponse(this.state);
                return true;

            case 'createCampaign':      
                Services.createCampaign(msg.options)
                    .then(response => {
                        if (response.status === 201) {
                            this.initialize();
                            this.state.mappedToCampaign = true;
                            this.state.campaignId = response.data.campaignId;
                            this.state.expedition.campaignId = response.data.campaignId;
                            this.state.message = 'Campaign was created'
                            sendResponse(this.state);
                        }
                        if (response.status === 501) {
                            this.initialize();
                            this.state.message = '501: Failed to create a campaign';
                            sendResponse(this.state);
                        }
                    })
                    .catch(e => {
                        this.initialize();
                        this.state.message = e.message;
                        sendResponse(this.state);
                    });
                return true;

            case 'joinCampaign':
                Services.joinCampaign(msg.campaignId)
                    .then(response => {
                        if (response.status === 204) {
                            this.initialize();
                            this.state.message = 'No such campaign';
                        };
                        if (response.status === 200) {
                            this.initialize();
                            this.state.mappedToCampaign = true;
                            this.state.campaignId = response.data.campaignId;
                            this.state.expedition.campaignId = response.data.campaignId;
                            this.state.message = 'Campaign linked';
                        };
                        if (response.status === 500) {
                            this.initialize();
                            this.state.message = response.data;
                        };
                        sendResponse(this.state);
                    })
                    .catch(e => {
                        this.initialize();
                        this.state.message = e.message;
                        sendResponse(this.state);
                    });
                return true;

            case 'startExpedition':
                this.state.isRecording = true;
                this.state.expedition.events = [];
                this.navigationListener.startExpedition(this.state);
                sendResponse(this.state);
                return true;

            case 'addEventToExpedition':
                chrome.extension.getBackgroundPage().console.log(`Add event : ${msg.event.type}`);
                if(this.state.expedition.events){
                    this.state.expedition.events.push(msg.event);
                }
                sendResponse(this.state);
                return true;

            case 'publishExpedition':  // TODO Add url to the expedition object
                this.state.expedition.result = msg.result;
                Services.publishExpedition(this.state.expedition)
                    .then(response => {
                        this.state.isRecording = false;
                        this.state.expedition.events = [];
                        sendResponse(this.state);
                    })
                    .catch(e => {
                        this.state.message = e.message;
                        sendResponse(this.state);
                    });
                return true;

            case 'deleteExpedition':
                this.state.expedition.events = [];
                this.state.isRecording = false;
                sendResponse(this.state);
                return true;
        }
    }
}

var background = new Background();
background.start();
