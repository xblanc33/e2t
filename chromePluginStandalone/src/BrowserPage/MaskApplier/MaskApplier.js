const MODES = {
    INPUT: 'input',
    EXPLORE: 'explore',
    STOP: 'stop'
};

export default class MaskApplier {

    apply(state, document) {
        if (state.mode === MODES.INPUT) {
            applyMaskInput(state, document);
        }
    }

}

function applyMaskInput(state, document) {
    state.registeredEvents.forEach(event => {
        const element = document.querySelector(event.selector);
        element.style["outline"] = `5px solid rgb(128, 0, 128)`;
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