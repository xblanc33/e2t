let Services = require('./Services');


class Background {
    constructor() {
        chrome.extension.getBackgroundPage().console.log(`Log from popup.html`);
        this.handleMessage = this.handleMessage.bind(this);
    }

    start() {
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }

    handleMessage(msg, sender, sendResponse) {
        chrome.extension.getBackgroundPage().console.log(`Background handleMessage kind : ${msg.kind}`);
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
            chrome.extension.getBackgroundPage().console.log(`Calling Services.signup from background.js`);
            Services.signup(msg.credentials)
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
