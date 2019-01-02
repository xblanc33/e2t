function hashItem(event) {
    return hashCode(event.type+event.selector);
}

function hashNGram(eventSeq) {
    return hashCode(eventSeq.map( event => {
        return event.type+event.selector;
    }).join(','));
}

function hashCode(s) {
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