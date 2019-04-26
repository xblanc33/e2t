import CSS from "./mask_css";

const MODES = {
    INPUT: 'input',
    EXPLORE: 'explore',
    STOP: 'stop'
};

const NEVER_THRESHOLD = 0;
const SOMETIMES_THRESHOLD = 0.8;

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

    initCSS(document) {
        const css = CSS;
        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(style);
    }

}

function clear(document) {
    const cssClasses = ["registered", "never", "sometimes", "often"];
    cssClasses.forEach(cssClass => {
        const elements = document.querySelectorAll(`.${cssClass}`);
        elements.forEach((element) => {
            if (element) {
                element.classList.remove(cssClass);
            }
        });
    }); 
}

function applyMaskInput(state, document) {
    clear(document);

    state.registeredEvents.forEach(event => {
        const elements = document.querySelectorAll(event.selector);
        elements.forEach((element) => element.classList.add('registered'));
    });
}


function applyMaskExplore(state, document) {
    clear(document);

    const availableElements = [];
    state.registeredEvents.forEach(event => {
        if (document.querySelector(event.selector)) {
            availableElements.push(event);
        }
    });

    chrome.runtime.sendMessage({
        kind: 'getProbabilities',
        events: availableElements
    }, {}, probabilitiesPerEvent => {
        if (probabilitiesPerEvent) {
            probabilitiesPerEvent.forEach((probabilityForEvent) => {
                const event = probabilityForEvent.event;
                const probability = probabilityForEvent.probability;
                let classToApply;
                if (probability <= NEVER_THRESHOLD) {
                    classToApply = "never";
                } else if (probability <= SOMETIMES_THRESHOLD) {
                    classToApply = "sometimes";
                } else {
                    classToApply = "often";
                }
                const elements = document.querySelectorAll(event.selector);
                elements.forEach((element) => element.classList.add(classToApply));
            });
        }
    });
}
