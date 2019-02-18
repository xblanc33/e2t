let NaturalnessModel = require ('./NaturalnessModel.js').NaturalnessModel;
let Event = require ('./Event.js').Event;
let Sequence = require ('./Sequence.js').Sequence;
let NavigationListener = require('./NavigationListener');

const DEPTH = 4;
const PROBA_OF_UNKNOWN = 0.000001;

class Background {
    constructor() {
        this.state = {
            windowId: undefined,
            isRecording: false,
            expedition: {
                events: []
            },
            naturalnessModel: undefined,
            message: `Plugin was just initialized`
        };


        this.handleMessage = this.handleMessage.bind(this);
        this.navigationListener = new NavigationListener();
    }

    start() {
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }

    handleMessage(msg, sender, sendResponse) {
        switch (msg.kind) {
            case 'startExpedition':
                this.state.windowId = msg.windowId;
                this.state.isRecording = true;
                this.state.expedition.events = [];
                this.state.naturalnessModel = new NaturalnessModel(DEPTH, PROBA_OF_UNKNOWN);
                this.navigationListener.startExpedition(this.state);
                sendResponse(this.state);
                return true;

            case 'stopExpedition':
                this.state.isRecording = false;
                this.state.expedition.events = [];
                sendResponse(this.state);
                return true;

            case 'addEventToExpedition':
                chrome.extension.getBackgroundPage().console.log(`Add event : ${msg.event.type}`);
                if (this.state.isRecording && this.state.expedition.events) {
                    this.state.expedition.events.push(msg.event);
                    if (this.state.expedition.events.length > DEPTH) {
                        let sequence = extractSequence(this.state.expedition);
                        console.log(`crossEntropy : ${this.state.naturalnessModel.crossEntropy(sequence)}`)
                        this.state.naturalnessModel.learn(sequence);
                        this.state.expedition.events.shift();
                    }
                }
                return false;  //TODO sendReponse raise an "Attempting to use a disconnected port object" error. Probably because the onPageListener tab (??) doesn't exist anymore
        }
    }
}

function extractSequence(expedition) {
    let eventList = expedition.events.map(event => {
        let eventValue = event.type + event.selector + event.value;
        return new Event(eventValue);
    });
    return new Sequence(eventList);
}

var background = new Background();
background.start();
