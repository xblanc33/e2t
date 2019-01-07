function hashItem(event) {
    if (event === undefined || event === null) throw 'cannot hash undefined / null item';
    return hash = hashCode(event.type+event.selector);
}

function hashNGram(eventSeq) {
    if (eventSeq === undefined || eventSeq === null) throw 'cannot hash undefined / null eventSeq';
    if (eventSeq.length && eventSeq.length === 0) throw 'cannot hash empty eventSeq';
    return hashCode(eventSeq.map( event => {
        return event.type+event.selector;
    }).join(','));
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
    return hash;
}

module.exports.hashItem = hashItem;
module.exports.hashNGram = hashNGram;
module.exports.hashCode = hashCode;