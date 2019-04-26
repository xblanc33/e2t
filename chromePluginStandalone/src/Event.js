export default class Event {
    
    constructor(type, selector, DOMEvent) {
        this.type = type;
        this.selector = selector;
        this.DOMEvent = DOMEvent;
        this.id = hashCode(JSON.stringify(this));
    }

    toString() {
        return `${this.type},${this.selector}`;
    }
}


function hashCode(s) {
    if (s === undefined || s === null) throw 'cannot hash undefined / null';
    let hash = 0, i, chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
}
