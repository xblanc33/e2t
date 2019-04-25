import EventRegister from './EventRegister/EventRegister';

const MODES = {
    INPUT: 'input',
    EXPLORE: 'explore',
    STOP: 'stop'
};

export default class EventScheduler {

    constructor(eventRegister) {
        this.eventRegister = eventRegister;
    }

    setState(newState) {
        this.state = newState;
    }

    onEvent(event) {
        if (this.state.mode === MODES.INPUT) {
            event.DOMEvent.stopPropagation();

            const index = this.state.registeredEvents.findIndex((e) => event.id === e.id);
            if (index >= 0) {
                this.eventRegister.unregisterEvent(event);
            } else {
                this.eventRegister.registerNewEvent(event);
            }
        }
    }

}