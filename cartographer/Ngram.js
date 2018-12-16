class Ngram {
    constructor(hash) {
        this.hash = hash;
        this.successorMap = new Map();
        this.size = 0;
    }

    getSuccessorProbability(eventHash) {
        let occurence = this.successorMap.get(eventHash);
        return occurence === undefined ? 0 : occurence / this.size;
    }

    updateSuccessorOccurence(eventHash) {
        let occurence = this.successorMap.get(eventHash);
        occurence === undefined ? occurence = 1 : occurence++ ;
        this.successorMap.set(eventHash, occurence);
    }
}

module.exports = Ngram;