import EventListener from "./EventListener/EventListener";
import EventScheduler from "./EventScheduler";
import MaskApplier from "./MaskApplier/MaskApplier";

const HANDLED_EVENT_TYPES = ["change", "click"];

class BrowserPage {

    constructor() {
        this.handleMessages = this.handleMessages.bind(this);

        this.init = true;
        this.handle_types = HANDLED_EVENT_TYPES;
        this.eventListener = new EventListener(document);

        this.maskApplier = new MaskApplier(this.naturalnessModel);
        this.maskApplier.initCSS(document);

        this.eventScheduler = new EventScheduler();
        this.eventListener.addObserver(this.eventScheduler);


        //Background update
        chrome.runtime.onMessage.addListener(this.handleMessages);

        //Content Event
        HANDLED_EVENT_TYPES.forEach(type => {
            document.body.addEventListener(type, this.eventListener.receiveEvent, true);
        });

        setInterval(() => {
            this.maskApplier.apply(this.state, document);
        }, 1000);


        chrome.runtime.sendMessage({
            kind: 'getState'
        }, {}, 
        state => {
            this.state = state;
            this.eventScheduler.state = state;
        });
    }

    handleMessages(msg, sender, sendResponse) {
        switch(msg.kind) {

            case 'isInit': 
                sendResponse({init: this.init});
                return true;

            case 'setState': {
                const newState = msg.newState;
                this.state = newState;
                this.eventScheduler.state = newState;
                return true;
            }
        }
    }

}

const content = new BrowserPage();

