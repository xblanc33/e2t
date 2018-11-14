let Services = require('./Services');


class Background {
    constructor() {
        chrome.extension.getBackgroundPage().console.log(`Log from popup.html`);
        this.handleMessage = this.handleMessage.bind(this);
    }

    start() {
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }

    handleMessage(msg, sender, sendResponse) {  //TODO There should be a way to remove code there
        switch (msg.kind) {

        case 'signIn':
            Services.signin(msg.credentials)
                .then(response => sendResponse(response))
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
            Services.createCampaign()
                .then(response => sendResponse(response))
                .catch(e => {
                    console.error(e.stack);
                    sendResponse(false);
                });
            return true;

        case 'joinCampaign':
            Services.joinCampaign(msg.data)
                .then(response => sendResponse(response))
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
