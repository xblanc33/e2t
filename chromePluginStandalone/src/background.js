let NaturalnessModel = require('./NaturalnessModel.js').NaturalnessModel;
let Event = require('./Event.js').Event;
let Sequence = require('./Sequence.js').Sequence;
let Ngram = require('./Ngram.js').Ngram;
let NavigationListener = require('./NavigationListener');

const DEPTH = 2;
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
                //console.log('addEventToExpedition');
                if (this.state.isRecording && this.state.expedition.events) {
                    this.state.expedition.events.push(msg.event); //DEPTH+1
                    let sequence = extractSequence(this.state.expedition);
                    this.state.naturalnessModel.learn(sequence);
                    //console.log(`learn:${JSON.stringify(sequence)}`);

                    if (this.state.expedition.events.length == (DEPTH+1)) {    
                        //console.log('shift');
                        this.state.expedition.events.shift();
                    }
                }
                return false; //TODO sendReponse raise an "Attempting to use a disconnected port object" error. Probably because the onPageListener tab (??) doesn't exist anymore

            case 'getProbabilities':
                //console.log('getProbabilities');
                let eventList = this.state.expedition.events.map(event => {
                    let eventValue = event.type + event.selector + event.value;
                    return new Event(eventValue);
                });
                let ngram = new Ngram(eventList);
                //console.log('ngram');
                //console.log(JSON.stringify(ngram));
                let successorModel = this.state.naturalnessModel.getNgramSuccessorModel(ngram);
                //console.log('successorModel');
                //console.log(JSON.stringify(successorModel));
                var probabilities = msg.events.map(event => {
                    let proba = 0;
                    if (successorModel != undefined) {
                        proba = successorModel.getProbability(new Event(event.type + event.selector + event.value));
                        //console.log('successModel:'+proba);
                    }
                    return {
                        selector: event.selector,
                        probability: proba
                    };
                });
                //console.log(probabilities);

                let knownProba = probabilities.filter(prob => prob.probability > 0);
                console.log(knownProba);

                sendResponse({
                    probabilities
                });
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