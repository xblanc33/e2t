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
        if (this.suite.length === 0) {
            throw 'Suite is empty';
        }

        if (this.suite.length === 1) {
            return {
                crossEntropy : UPPER_BOUND,
                index : 0,
                sequence : this.suite[0]
            }
        }
        let moreNatural = {
            crossEntropy : UPPER_BOUND
        }
        this.suite.forEach( (sequence, index) => {
            let model = new NaturalnessModel();
            let suiteCopy = this.suite.slice(0);
            suiteCopy.splice(index, 1);
            suiteCopy.forEach(seq => model.learn(seq));
            let crossEntropy = model.crossEntropy(sequence);
            if (crossEntropy < moreNatural.crossEntropy) {
                moreNatural.crossEntropy = crossEntropy;
                moreNatural.sequence = sequence;
                moreNatural.index = index;
            }
        });
        return moreNatural;
    }

    rank() {
        if (this.suite.length === 0) return [];

        let rank = [];
        let moreNatural = this.getMoreNatural();
        rank.push({sequence:moreNatural.sequence, crossEntropy:moreNatural.crossEntropy});
        let suiteCopy = this.suite.slice(0);
        suiteCopy.splice(moreNatural.index, 1);
        let other = new SequenceSuite(suiteCopy);
        rank.push(...other.rank());
        return rank;
    }
}

module.exports.SequenceSuite = SequenceSuite;