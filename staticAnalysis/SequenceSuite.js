const Sequence = require('./Sequence.js').Sequence;
const NaturalnessModel = require('./NaturalnessModel.js').NaturalnessModel;

const UPPER_BOUND = 40;

class SequenceSuite {
    constructor(suite) {
        if (suite === null || suite === undefined) {
            throw 'cannot create SequenceSuite with no suite';
        }
        if (!(Array.isArray(suite))) {
            throw 'cannot create SequenceSuite with no array';
        }
        suite.forEach(seq => {
            if (!(seq instanceof Sequence)) {
                throw 'cannot create SequenceSuite with no array of Sequence';
            }
        })
        this.suite = suite;
    }

    getMoreNatural() {
        let moreNatural = {
            crossEntropy : 0
        }
        this.suite.forEach( (sequence, index) => {
            let model = new NaturalnessModel();
            let other = this.suite.slice(0).splice(index, 1);
            other.forEach(seq => model.learn(seq));
            let crossEntropy = model.crossEntropy(sequence);
            if (crossEntropy > moreNatural.crossEntropy) {
                moreNatural.crossEntropy = crossEntropy;
                moreNatural.sequence = sequence;
                moreNatural.index = index;
            }
        });
        return moreNatural;
    }
}

module.exports.SequenceSuite = SequenceSuite;