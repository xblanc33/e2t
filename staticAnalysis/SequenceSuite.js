const Sequence = require('./Sequence.js').Sequence;
const NaturalnessModel = require('./NaturalnessModel.js').NaturalnessModel;

const DEPTH = 4;
const PROBA_OF_UNKNOWN = 0;//0.000001;
const UPPER_BOUND = -Math.log2(PROBA_OF_UNKNOWN);

class SequenceSuite {
    constructor(suite, depth, probaOfUnknown) {
        this.depth = depth || DEPTH;
        this.probaOfUnknown = probaOfUnknown || PROBA_OF_UNKNOWN;
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
                name : this.suite[0].name,
                sequence : this.suite[0]
            }
        }
        let moreNatural = {
            crossEntropy : UPPER_BOUND
        }
        this.suite.forEach( (sequence, index) => {
            let model = new NaturalnessModel(this.depth, this.probaOfUnknown);
            let suiteCopy = this.suite.slice(0);
            suiteCopy.splice(index, 1);
            suiteCopy.forEach(seq => model.learn(seq));
            let crossEntropy = model.crossEntropy(sequence);
            console.log(`crossEntropy ${sequence.name} = ${crossEntropy}`);
            if (crossEntropy <= moreNatural.crossEntropy) {
                moreNatural.crossEntropy = crossEntropy;
                moreNatural.sequence = sequence;
                moreNatural.name = sequence.name;
            }
        });
        return moreNatural;
    }

    rank() {
        if (this.suite.length === 0) return [];

        let rank = [];
        let moreNatural = this.getMoreNatural();
        if (moreNatural.sequence === undefined) console.log('undefined!!!');
        rank.push({sequence:moreNatural.sequence, crossEntropy:moreNatural.crossEntropy});
        let suiteCopy = this.suite.slice(0);
        suiteCopy.splice(moreNatural.index, 1);
        let other = new SequenceSuite(suiteCopy, this.depth, this.probaOfUnknown);
        rank.push(...other.rank());
        return rank;
    }
}

module.exports.SequenceSuite = SequenceSuite;