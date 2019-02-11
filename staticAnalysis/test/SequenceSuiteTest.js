const assert = require('chai').assert;
const NaturalnessModel = require('../NaturalnessModel.js').NaturalnessModel;
const Element = require('../Element.js').Element;
const Sequence = require('../Sequence.js').Sequence;
const SequenceSuite = require('../SequenceSuite.js').SequenceSuite;

describe('SequenceSuite', function() {
    describe('#getMoreNatural()', () => {
      it ('should return sequenceSample.one (index 0)', () => {
          let sequenceSample = createSequence();
          let seqSuite = new SequenceSuite([sequenceSample.one, sequenceSample.two, sequenceSample.three]);
          let res = seqSuite.getMoreNatural();
          assert.equal(res.index, 0);
      });
    });
    describe('#rank()', () => {
        it ('should return 0, 1, 2', () => {
            let sequenceSample = createSequence();
            let seqSuite = new SequenceSuite([sequenceSample.one, sequenceSample.two, sequenceSample.three]);
            let res = seqSuite.rank();
            assert.equal(res[0].sequence, sequenceSample.one);
            assert.equal(res[1].sequence, sequenceSample.two);
            assert.equal(res[2].sequence, sequenceSample.three);
        });
      });
});


function createSequence() {
    let a = new Element('a');
    let b = new Element('b');
    let c = new Element('c');
    let d = new Element('d');
    let e = new Element('e');
    let f = new Element('f');
    
    return {
        one : new Sequence([a,b,c,d,e]),
        two : new Sequence([a,b,c,d,c]),
        three : new Sequence([f,f,f,f,f,f,f,f,f,f])
    }
}