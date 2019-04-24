import Event from '../../Event';
import CssSelectGenerator from './cssSelectorGenerator';

export default class EventListener {

    constructor(document) {
        this.document = document;
        this.observers = [];
        this.selectorGenerator = new CssSelectGenerator();

        this.receiveEvent = this.receiveEvent.bind(this);
        this.notifyObservers = this.notifyObservers.bind(this);
    }

    receiveEvent(e) {
        const event = new Event(e.type, this.selectorGenerator.generate(e.target), e);
        this.notifyObservers(event);
    }

    addObserver(o) {
        this.observers.push(o);
    }

    notifyObservers(event) {
        this.observers.forEach(observer => observer.onEvent(event));
    }

}