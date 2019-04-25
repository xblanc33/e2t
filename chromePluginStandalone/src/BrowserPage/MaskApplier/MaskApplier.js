const MODES = {
    INPUT: 'input',
    EXPLORE: 'explore',
    STOP: 'stop'
};

const NEVER_THRESHOLD = 0;
const SOMETIMES_THRESHOLD = 0.8;
const OFTEN_THRESHOLD = 1;

export default class MaskApplier {

    constructor(naturalnessModel) {
        this.naturalnessModel = naturalnessModel;
    }

    apply(state, document) {
        if (state.mode !== MODES.EXPLORE) {
            applyMaskInput(state, document);
        } else {
            applyMaskExplore(state, document);
        } 
    }

}

function applyMaskInput(state, document) {
    state.registeredEvents.forEach(event => {
        const element = document.querySelector(event.selector);
        if (element) {
            element.classList.add('registered');
        }
    });
}

function applyMaskExplore(state, document) {
    state.registeredEvents.forEach(event => {
        const element = document.querySelector(event.selector);
        if (element) {
            const model = this.state.naturalnessModel;
            this.state.registeredEvents.forEach(event => {
                const proba = model.getPro;
            });
            element.classList.add('registered');
        }
    });
}

/*
applyMask(document, chrome) {
        const elements = document.querySelectorAll('*');

        const events = [];
        elements.forEach(element => events.push({
            type: 'click',
            selector: this.cssSelectGenerator.generate(element),
            value: 'click'
        }));
    
        chrome.runtime.sendMessage({
            kind: 'getProbabilities',
            events
        }, {},
        response => {
            if (response && response.probabilities) {
                response.probabilities
                    //.filter(element => element.probability > 0)
                    .forEach(probability_per_selector => {
                        const element = document.querySelector(probability_per_selector.selector);
                        const value = (probability_per_selector.probability) * 255;
                        element.style["outline"] = '5px solid rgb(' + value + ', ' + (255 - value) + ', 0, 0.90)';
                    });
            }
        });
    }*/