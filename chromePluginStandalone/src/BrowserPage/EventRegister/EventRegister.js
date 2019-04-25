
export default class EventRegister {

    constructor() {
        this.registerNewEvent = this.registerNewEvent.bind(this);
    }

    registerNewEvent(event) {
        const message = `
        Register: \n
        selector : ${event.selector} \n
        type : ${event.type} \n`;

        if (window.confirm(message)) {
            event.DOMEvent.target.classList.add('registered');
            chrome.runtime.sendMessage({
                kind: 'registerEvent',
                event
            }, {});
        }
    }


    unregisterEvent(event) {
        const message = `
        Unregister : \n
        selector : ${event.selector} \n
        type : ${event.type} \n`;

        event.DOMEvent.target.classList.remove('registered');
        chrome.runtime.sendMessage({
            kind: 'unregisterEvent',
            event
        }, {});

    }
    
}