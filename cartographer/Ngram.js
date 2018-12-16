class Ngram {
    constructor(hash) {
        this.hash = hash;
        successorMap = new Map();
        this.size = 0;
    }

    getSuccessorProbability(eventHash) {
        let occurence = successorMap.get(eventHash);
        return occurence === undefined ? 0 : occurence / this.size;
    }

    updateSuccessorOccurence(eventHash) {
        let occurence = successorMap.get(eventHash);
        occurence === undefined ? occurence = 1 : occurence++ ;
        successorMap.set(eventHash, occurence);
    }
}

module.exports = Ngram;