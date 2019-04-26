import {Sequence, Ngram, NaturalnessModel}  from "naturalness";
import {Event as NaturalnessEvent}  from "naturalness";
import NavigationListener from "../NavigationListener";

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

            naturalnessModel: new NaturalnessModel(DEPTH, PROBA_OF_UNKNOWN),
        };

        this.handleMessage = this.handleMessage.bind(this);
        this.navigationListener = new NavigationListener();
    }

    start() {
        chrome.runtime.onMessage.addListener(this.handleMessage);
        this.updateContentState();
    }

    handleMessage(msg, sender, sendResponse) {
        switch (msg.kind) {

            case 'startExpedition':
                this.state.mode = MODES.EXPLORE;
                this.state.expedition.events = [];
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

            case 'init':
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        kind: 'isInit'
                    }, response => {
                        if (chrome.runtime.lastError) {
                            var errorMsg = chrome.runtime.lastError.message;
                            if (errorMsg == "Could not establish connection. Receiving end does not exist.") {
                                this.navigationListener.startNavigation(msg.windowId);
                            }
                        }
                        sendResponse({init: true});
                    });
                });
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
                if (!this.state.registeredEvents.find((e) => e.id === event.id)) {
                    return;
                }
                this.state.expedition.events.push(new NaturalnessEvent(`${event.type},${event.selector}`));
                let sequence = new Sequence(this.state.expedition.events);

                this.state.naturalnessModel.learn(sequence);
            
                if (this.state.expedition.events.length == (DEPTH + 1)) {
                    this.state.expedition.events.shift();
                }
                this.updateContentState();
                return true;
            }

            case 'getProbabilities': {
                let ngram = new Ngram(this.state.expedition.events);
                let successorModel = this.state.naturalnessModel.getNgramSuccessorModel(ngram);
                var probabilitiesPerEvent = msg.events.map(event => {
                    let probability = 0;
                    if (successorModel) {
                        probability = successorModel.getProbability(new NaturalnessEvent(`${event.type},${event.selector}`));
                    }
                    return {
                        event,
                        probability
                    };
                });
                
                return sendResponse(
                    probabilitiesPerEvent
                );
            }
        }
    }

    updateContentState() {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                kind: 'setState',
                newState: this.state
            });
        });
    }
}


var background = new Background();
background.start();
