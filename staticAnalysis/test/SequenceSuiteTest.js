const assert = require('chai').assert;
const Event = require('../Event.js').Event;
const Sequence = require('../Sequence.js').Sequence;
const SequenceSuite = require('../SequenceSuite.js').SequenceSuite;

const DEPTH = 2;
const PROBA_OF_UNKNOWN = 0.000001;

describe('SequenceSuite', function() {
    describe('#getMoreNatural()', () => {
      it ('should return sequenceSample.one (index 0)', () => {
          let sequenceSample = createSequence();
          let seqSuite = new SequenceSuite([sequenceSample.one, sequenceSample.two, sequenceSample.three], DEPTH, PROBA_OF_UNKNOWN);
          let res = seqSuite.getMoreNatural();
          assert.equal(res.name, "one");
      });
    });
    describe('#rank()', () => {
        it ('should return 0, 1, 2', () => {
            let sequenceSample = createSequence();
            let seqSuite = new SequenceSuite([sequenceSample.one, sequenceSample.two, sequenceSample.three], DEPTH, PROBA_OF_UNKNOWN);
            let res = seqSuite.rank();
            assert.equal(res[0].sequence, sequenceSample.one);
            assert.equal(res[1].sequence, sequenceSample.two);
            assert.equal(res[2].sequence, sequenceSample.three);
        });
      });
});


function createSequence() {
    let a = new Event('a');
    let b = new Event('b');
    let c = new Event('c');
    let d = new Event('d');
    let e = new Event('e');
    let f = new Event('f');
    
    return {
        one : new Sequence([a,b,c,d], "one"),
        two : new Sequence([a,b,c,d,c], "two"),
        three : new Sequence([f,f,f,f,f,f,f,f,f,f], "three")
    }
}