const assert = require('chai').assert;
const NaturalnessModel = require('../NaturalnessModel.js').NaturalnessModel;
const Element = require('../Element.js').Element;
const Sequence = require('../Sequence.js').Sequence;

describe('Element', function() {
    describe('#learn()', () => {
        it('should add 5 Ngram to the map', () => {
          let sequenceSample = createSequence();
          let model = new NaturalnessModel();
          model.learn(sequenceSample.one);
          assert.equal(model.ngramMap.size, 5);
        });
        it('should add 5 Ngram to the map', () => {
          let sequenceSample = createSequence();
          let model = new NaturalnessModel();
          model.learn(sequenceSample.one);
          model.learn(sequenceSample.two);
          assert.equal(model.ngramMap.size, 5);
        })
    });
    describe('#crossEntropy()', () => {
      it ('should compute crossEntropy with all right', () => {
          let model = new NaturalnessModel();
          let emptySeq = new Sequence();
          let crossEnt = model.crossEntropy(emptySeq);
          assert.equal(crossEnt, model.probaOfUnknown);
      });
      it ('should compute crossEntropy with all right', () => {
          let model = new NaturalnessModel();
          let sequenceSample = createSequence();
          model.learn(sequenceSample.one);
          let crossEnt = model.crossEntropy(sequenceSample.one);
          let right = 1 - model.probaOfUnknown;
          let expected = - (5 * Math.log2(right)) / 5;
          assert.equal(crossEnt, expected);
      });
      it ('should compute crossEntropy with one wrong', () => {
          let model = new NaturalnessModel();
          let sequenceSample = createSequence();
          model.learn(sequenceSample.one);
          let crossEnt = model.crossEntropy(sequenceSample.two);
          let right = 1 - model.probaOfUnknown;
          let wrong = model.probaOfUnknown;
          let expected = - (4 * Math.log2(right) + Math.log2(wrong)) / 5;
          assert.equal(crossEnt, expected);
      });
      it ('should compute crossEntropy with all wrong', () => {
          let model = new NaturalnessModel();
          let sequenceSample = createSequence();
          model.learn(sequenceSample.one);
          let crossEnt = model.crossEntropy(sequenceSample.three);
          let wrong = model.probaOfUnknown;
          let expected = - (Math.log2(wrong)+Math.log2(wrong)+Math.log2(wrong)+Math.log2(wrong)+Math.log2(wrong)+Math.log2(wrong)+Math.log2(wrong)+Math.log2(wrong)+Math.log2(wrong)+Math.log2(wrong)) / 10;
          assert.equal(crossEnt, expected);
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