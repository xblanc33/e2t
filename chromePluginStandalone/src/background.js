let NaturalnessModel = require('./NaturalnessModel.js').NaturalnessModel;
let Event = require('./Event.js').Event;
let Sequence = require('./Sequence.js').Sequence;
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
                if (this.state.isRecording && this.state.expedition.events) {
                    this.state.expedition.events.push(msg.event);
                    if (this.state.expedition.events.length > DEPTH) {
                        let sequence = extractSequence(this.state.expedition);
                        this.state.naturalnessModel.learn(sequence);
                        this.state.expedition.events.shift();
                    }
                }
                return false; //TODO sendReponse raise an "Attempting to use a disconnected port object" error. Probably because the onPageListener tab (??) doesn't exist anymore

            case 'getProbabilities':
                if (this.state.expedition.events.length < DEPTH) {
                    sendResponse(null)
                    return
                }
                chrome.extension.getBackgroundPage().console.log(this.state.expedition.events);
                const probabilities = msg.events.map(event => {
                    const expedition_events = this.state.expedition.events.slice()
                    expedition_events.push(event)

                    const sequence = extractSequence({
                        events: expedition_events
                    })
                    return {
                        selector: event.selector,
                        probability: this.state.naturalnessModel.crossEntropy(sequence)
                    }
                })
                sendResponse({
                    probabilities
                })
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