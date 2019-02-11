const Sequence = require('./Sequence.js').Sequence;

const PROBA_OF_UNKNOWN = 0.000001;
const DEPTH = 3;

class NaturalnessModel {
    constructor(depth, probaOfUnknown) {
        this.ngramMap = new Map();
        this.depth = depth || DEPTH;
        this.probaOfUnknown = probaOfUnknown || PROBA_OF_UNKNOWN;
    }

    crossEntropy(sequence) {
        checkSequenceType(sequence);
        if (sequence.elementList.length === 0) return this.probaOfUnknown;
        let probabilitySum = 0;
        for (let index = 0; index < sequence.elementList.length; index++) {
            let currentElement = sequence.elementList[index];
            let currentNgram = sequence.getNgram(index, this.depth);
            let modelProba = this.getProbability(currentNgram, currentElement);
            let proba;
            if (modelProba === 0) {
                proba = this.probaOfUnknown;
            } else {
                proba = modelProba * (1-this.probaOfUnknown)
            }
            probabilitySum = probabilitySum + Math.log2(proba);
        }
        return -(probabilitySum / sequence.elementList.length);
    }

    learn(sequence) {
        checkSequenceType(sequence);
        for (let index = 0; index < sequence.elementList.length; index++) {
            let ngram = sequence.getNgram(index,this.depth);
            let ngramSuccessor = this.ngramMap.get(ngram.key);
            if (ngramSuccessor === undefined) {
                ngramSuccessor = {};
                ngramSuccessor[`${sequence.elementList[index].key}`] = 0;
                ngramSuccessor.cardinality = 0;
            }
            ngramSuccessor[`${sequence.elementList[index].key}`]++;
            ngramSuccessor.cardinality++;
            this.ngramMap.set(ngram.key, ngramSuccessor);
        }
    }

    getProbability(ngram, element) {
        let probability;
        let ngramSuccessor = this.ngramMap.get(ngram.key);
        if (ngramSuccessor === undefined) {
            return 0;
        }
        
        let elementModelProba = ngramSuccessor[`${element.key}`];
        if (elementModelProba === undefined) {
            return 0;
        }

        return probability = elementModelProba / ngramSuccessor.cardinality;;
    }
}

function checkSequenceType(sequence) {
    if (!(sequence instanceof Sequence)) {
        throw 'sequence is not a Sequence';
    }
}

module.exports.NaturalnessModel = NaturalnessModel;