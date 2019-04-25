import EventListener from "./EventListener/EventListener";
import EventRegister from "./EventRegister/EventRegister";
import EventScheduler from "./EventScheduler";
import MaskApplier from "./MaskApplier/MaskApplier";

const HANDLED_EVENT_TYPES = ["change", "click"];

class PageContent {

    constructor() {
        this.handleMessages = this.handleMessages.bind(this);

        this.init = true;
        this.handle_types = HANDLED_EVENT_TYPES;
        this.eventListener = new EventListener(document);
        this.eventRegister = new EventRegister();

        this.maskApplier = new MaskApplier(this.naturalnessModel);

        this.eventScheduler = new EventScheduler(this.eventRegister);
        this.eventListener.addObserver(this.eventScheduler);


        //Background update
        chrome.runtime.onMessage.addListener(this.handleMessages);

        //Content Event
        HANDLED_EVENT_TYPES.forEach(type => {
            document.body.addEventListener(type, this.eventListener.receiveEvent, true);
        });

        applyCSS();
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

const content = new PageContent();

function applyCSS(){
    const css = `
        .registered {
            outline: 5px solid rgb(128, 0, 128);
            outline-offset: '-4px';
        }
        .never {
            outline: 4px solid #0000ff;
            outline-offset: '-4px';
        }
        
        .sometimes {
          outline: 4px solid #008000;
          outline-offset: '-4px';
        }
        
        .often {
          outline: 4px solid #ff0000;
          outline-offset: '-4px';
        }`;
       
    var style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
}