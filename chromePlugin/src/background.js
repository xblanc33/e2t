let Services = require('./Services');
let NavigationListener = require('./NavigationListener');

class Background {
    constructor() {
        this.initialize();

        this.colors = [
            "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
            "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
            "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
            "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080",
            "#ffffff", "#000000"];  //TODO Set this in a shared between services conf file

        this.handleMessage = this.handleMessage.bind(this);
        this.navigationListener = new NavigationListener();
    }

    initialize() {
        this.state = {
            mappedToCampaign: false,
            windowId: undefined,
            isRecording: false,
            campaignId: undefined,
            autoPublish: false,
            autoPublishTime: 4000,
            autoPublishInterval: undefined,
            userId: undefined,
            userColor: undefined,
            expedition: {
                campaignId: undefined,
                events: []
            },
            message: `Plugin was just initialized`
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

            case 'launchAutoRecord':
                console.log(`launchAutoRecord:${msg.autoPublish}`);
                this.state.autoPublish = msg.autoPublish;
                this.state.autoPublishTime = msg.autoPublishTime;
                if (!this.state.autoPublish) {
                    console.log('clear');
                    if (this.state.autoPublishInterval) {
                        clearInterval(this.state.autoPublishInterval);
                    }
                } else {
                    console.log('start');
                    this.state.isRecording = true;
                    this.state.expedition.events = [];
                    this.navigationListener.startExpedition(this.state);
                    this.state.autoPublishInterval = setInterval(() => {
                        if (this.state.expedition.events.length > 0) {
                            Services.publishExpedition(this.state.expedition)
                                .then(response => {
                                    console.log('publishExpe');
                                    this.state.isRecording = false;
                                    this.state.expedition.events = [];
                                })
                                .catch(e => {
                                    this.state.message = e.message;
                                });
                        }
                    }, this.state.autoPublishTime);
                }
                sendResponse(this.state);
                return true;

            case 'getState':
                sendResponse(this.state);
                return true;

            case 'createCampaign':
                Services.createCampaign(msg.options)
                    .then(response => {
                        if (response.status === 200) {
                            this.initialize();
                            this.state.mappedToCampaign = true;
                            this.state.campaign = response.data.campaign;
                            this.state.campaignId = response.data.campaign.campaignId;
                            this.state.expedition.campaignId = response.data.campaign.campaignId;
                            this.state.userId = response.data.userId;
                            this.state.userColor = this.colors[response.data.campaign.profiles.indexOf(response.data.userId) % response.data.campaign.profiles.length];
                            this.state.message = 'Campaign was created';
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
                Services.joinCampaign(msg.campaignId, this.state.profile)
                    .then(response => {
                        chrome.extension.getBackgroundPage().console.log(`Response status is : ${response.status}`);
                        if (response.status === 204) {
                            this.initialize();
                            this.state.message = 'No such campaign';
                        }
                        if (response.status === 200) {
                            chrome.extension.getBackgroundPage().console.log(`Response data is : ${JSON.stringify(response.data)}`);
                            this.initialize();
                            this.state.mappedToCampaign = true;
                            this.state.campaign = response.data.campaign;
                            this.state.campaignId = response.data.campaign.campaignId;
                            this.state.expedition.campaignId = response.data.campaign.campaignId;
                            this.state.userId = response.data.userId;
                            this.state.userColor = this.colors[response.data.campaign.profiles.indexOf(response.data.userId) % response.data.campaign.profiles.length];
                            this.state.message = 'Campaign linked';
                        }
                        if (response.status === 500) {
                            this.initialize();
                            this.state.message = response.data;
                        }
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
                if (this.state.expedition.events) {
                    this.state.expedition.events.push(msg.event);
                }
                sendResponse(this.state);
                return true;

            case 'publishExpedition':  // TODO Add url to the expedition object
                this.state.expedition.result = msg.result;
                this.state.expedition.userId = this.state.userId;  //TODO This could be easily changed by the client... but does security really matter here ?
                this.state.expedition.userColor = this.state.userColor;
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
