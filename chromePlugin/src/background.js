let Services = require('./Services');
let NavigationListener = require('./NavigationListener');

class Background {
    constructor() {
        this.state = {
            mappedToCampaign : false,
            isRecording : false,
            campaignId : undefined,
            expedition : {
                campaignId: undefined,
                events: []
            },
            message : `Plugin was just created`
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
                sendResponse(this.state);
                return true;

            case 'createCampaign':      
                Services.createCampaign()
                    .then(response => {
                        if (response.status === 201) {
                            this.state = {
                                mappedToCampaign : true,
                                isRecording : false,
                                campaignId : response.data.campaignId,
                                expedition : {
                                    campaignId: response.data.campaignId,
                                    events: []
                                },
                                message : 'Campaign was created'
                            };
                            sendResponse(this.state);
                        }
                        if (response.status === 501) {
                            this.state = {
                                mappedToCampaign : false,
                                isRecording : false,
                                campaignId : undefined,
                                expedition : {
                                    campaignId: undefined,
                                    events: []
                                },
                                message : '501: Failed to create a campaign'
                            };
                            sendResponse(this.state);
                        }
                    })
                    .catch(e => {
                        this.state = {
                            mappedToCampaign : false,
                            isRecording : false,
                            campaignId : undefined,
                            expedition : {
                                campaignId: undefined,
                                events: []
                            },
                            message : e.message
                        };
                        sendResponse(this.state);
                    });
                return true;

            case 'joinCampaign':
                Services.joinCampaign(msg.campaignId)
                    .then(response => {
                        if (response.status === 204) {
                            this.state = {
                                mappedToCampaign : false,
                                isRecording : false,
                                campaignId : undefined,
                                expedition : {
                                    campaignId: undefined,
                                    events: []
                                },
                                message : 'No such campaign'
                            };
                        };
                        if (response.status === 200) {
                            this.state = {
                                mappedToCampaign : true,
                                isRecording : false,
                                campaignId : response.data.campaignId,
                                expedition : {
                                    campaignId: response.data.campaignId,
                                    events: []
                                },
                                message : 'Campaign linked'
                            };
                        };
                        if (response.status === 500) {
                            this.state = {
                                mappedToCampaign : false,
                                isRecording : false,
                                campaignId : undefined,
                                expedition : {
                                    campaignId: undefined,
                                    events: []
                                },
                                message : response.data
                            };
                        };
                        sendResponse(this.state);
                    })
                    .catch(e => {
                        this.state = {
                            mappedToCampaign : false,
                            isRecording : false,
                            campaignId : undefined,
                            expedition : {
                                campaignId: undefined,
                                events: []
                            },
                            message : e.message
                        };
                        sendResponse(this.state);
                    });
                return true;

            case 'startExpedition':
                this.state.isRecording = true;
                this.state.expedition.events = [];
                this.navigationListener.calibrate();
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
