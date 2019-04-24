import EventListener from "./EventListener/EventListener";
import EventRegister from "./EventRegister/EventRegister";
import EventScheduler from "./EventScheduler";
import MaskApplier from "./MaskApplier/MaskApplier";

const HANDLED_EVENT_TYPES = ["change", "click"];

class PageContent {

    constructor() {
        this.handle_types = HANDLED_EVENT_TYPES;
        this.eventListener = new EventListener(document);
        this.eventRegister = new EventRegister();
        this.maskApplier = new MaskApplier();

        this.eventScheduler = new EventScheduler(this.eventRegister);
        this.eventListener.addObserver(this.eventScheduler);


        //Background update
        this.onStateUpdate = this.onStateUpdate.bind(this);
        chrome.runtime.onMessage.addListener(this.onStateUpdate);

        //Content Event
        HANDLED_EVENT_TYPES.forEach(type => {
            document.body.addEventListener(type, this.eventListener.receiveEvent, true);
        });

        applyCSS();


        chrome.runtime.sendMessage({
            kind: 'getState'
        }, {}, 
        state => {
            this.state = state;
            this.eventScheduler.state = state;
            this.maskApplier.apply(state, document);
        });
    }

    onStateUpdate(newState) {
        this.state = newState;
        this.eventScheduler.state = newState;

        this.maskApplier.apply(newState, document);
    }

}

const content = new PageContent();

function attach() {
    /*   const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(
        input => {
            input.addEventListener('input', eventHandler.handleInput, true);
        }
    );

   const observer = new MutationObserver(eventHandler.handleMutation);
    const config = {
        childList: true,
        subtree: true
    };

    const all = document.querySelectorAll('*');
    all.forEach(
        element => {
            observer.observe(element, config);
        }
    );

    const selects = document.querySelectorAll('select');
    selects.forEach(
        select => {
            select.addEventListener('change', eventHandler.handleChange, true);
        }
    );
    
*/
    //applyClickProbabilityMask(cssSelectGenerator);
}

function applyCSS(){
    const css = `
        .registered {
            outline: 5px solid rgb(128, 0, 128);
        }`;
       
    var style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
}