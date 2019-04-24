let NaturalnessModel = require('../../../staticAnalysis/NaturalnessModel.js').NaturalnessModel;
let Event = require('../../../staticAnalysis/Event.js').Event;
let Sequence = require('../../../staticAnalysis/Sequence.js').Sequence;
let Ngram = require('../../../staticAnalysis/Ngram').Ngram;
let NavigationListener = require('../NavigationListener');

const DEPTH = 2;
const PROBA_OF_UNKNOWN = 0.000001;

const MODES = {
    INPUT: 'input',
    EXPLORE: 'explore',
    STOP: 'stop'
};

class Background {
    constructor() {

        this.state = {
            windowId: undefined,

            expedition: {
                events: []
            },
            mode: MODES.STOP,
            registeredEvents: [],

            naturalnessModel: undefined,
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
                this.state.mode = MODES.EXPLORE;
                this.state.expedition.events = [];
                this.state.naturalnessModel = new NaturalnessModel(DEPTH, PROBA_OF_UNKNOWN);
                this.navigationListener.startExpedition(this.state);
                this.updateContentState();
                sendResponse(this.state);
                return true;

            case 'stopExpedition':
                this.state.mode = MODES.STOP;
                this.state.expedition.events = [];
                this.updateContentState();
                sendResponse(this.state);
                return true;

            case 'startRegisteringInputs':
                this.state.mode = MODES.INPUT;
                this.updateContentState();
                sendResponse(this.state);
                return true;

            case 'getState':
                sendResponse(this.state);
                return true;

            case 'registerEvent': {
                const event = msg.event;

                this.state.registeredEvents.push(event);
                this.updateContentState();
                return true;
            }

            case 'unregisterEvent': {
                const event = msg.event;
                const index = this.state.registeredEvents.findIndex((e) => e.id === event.id);
                this.state.registeredEvents.splice(index, 1);
                this.updateContentState();
                return true;
            }

            case 'exploreEvent': {
                const event = msg.event;
                if (!this.state.registeredEvents.has(event)) {
                    return;
                }
                this.state.expedition.events.push(event);
                let sequence = extractSequence(this.state.expedition);
            
                this.state.naturalnessModel.learn(sequence);
            
                if (this.state.expedition.events.length == (DEPTH + 1)) {
                    this.state.expedition.events.shift();
                }
                this.updateContentState();
                return true;
            }

            case 'getProbabilities': {
                let eventList = this.state.expedition.events.map(event => {
                    let eventValue = event.type + event.selector + event.value;
                    return new Event(eventValue);
                });
                let ngram = new Ngram(eventList);
                let successorModel = this.state.naturalnessModel.getNgramSuccessorModel(ngram);
                var probabilities = msg.events.map(event => {
                    let proba = 0;
                    if (successorModel != undefined) {
                        proba = successorModel.getProbability(new Event(event.type + event.selector + event.value));
                    }
                    return {
                        selector: event.selector,
                        probability: proba
                    };
                });
                return sendResponse({
                    probabilities
                });
            }
        }
    }

    updateContentState() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            console.log(this.state);
            chrome.tabs.sendMessage(tabs[0].id, this.state);
        });
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