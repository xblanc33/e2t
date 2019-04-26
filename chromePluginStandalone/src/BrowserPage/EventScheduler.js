const MODES = {
    INPUT: 'input',
    EXPLORE: 'explore',
    STOP: 'stop'
};

export default class EventScheduler {

    setState(newState) {
        this.state = newState;
    }

    onEvent(event) {
        if (this.state.mode === MODES.INPUT) {
            event.DOMEvent.stopPropagation();
            const index = this.state.registeredEvents.findIndex((e) => event.id === e.id);
            if (index >= 0) {
                this.unregisterEvent(event);
            } else {
                this.registerNewEvent(event);
            }
        } else if (this.state.mode === MODES.EXPLORE) {
            const eventIsRegistered = this.state.registeredEvents.find((e) => event.id === e.id);
            if (eventIsRegistered) {
                this.exploreEvent(event);
            }
        }
    }

    exploreEvent(event) {
        if (this.state.registeredEvents.find((e) => event.id === e.id)) { 
            chrome.runtime.sendMessage({
                kind: 'exploreEvent',
                event
            }, {});
        }

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
        event.DOMEvent.target.classList.remove('registered');
        chrome.runtime.sendMessage({
            kind: 'unregisterEvent',
            event
        }, {});
    }

}