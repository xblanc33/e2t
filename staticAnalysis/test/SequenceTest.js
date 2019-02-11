const assert = require('chai').assert;
const Sequence = require('../Sequence.js').Sequence;
const Element = require('../Element.js').Element;

describe('Sequence', function() {
  describe('#constructor()', function() {
    it('should create an empty sequence', () => {
        let seq = new Sequence();
        assert.equal(seq.length, 0);
        assert.isTrue(Array.isArray(seq.elementList));
        assert.equal(seq.elementList.length, 0);
    });
    it('should create a sequence of elements', () => {
        let e = new Element('hey');
        let seq = new Sequence([e,e,e]);     
        assert.equal(seq.length, 3);
        assert.isTrue(Array.isArray(seq.elementList));
        assert.equal(seq.elementList.length, 3);
    });
  });
  describe('#append()', function() {
    it('should throw an exception with undefined element', () => {
        try  {
            let seq = new Sequence(undefined);
            seq.append();
            assert.fail();
        } catch (ex) {

        }
    });
    it('should throw an exception with null item', () => {
        try  {
            let seq = new Sequence(null);
            seq.append();
            assert.fail();
        } catch (ex) {

        }
    });
    it('should throw an exception with not an Element', () => {
        try  {
            let seq = new Sequence(null);
            seq.append('hey');
            assert.fail();
        } catch (ex) {

        }
    });
  });
  describe('#getNgram()', function() {
    it('should return empty Ngram', () => {
        let seq = new Sequence();
        let ng = seq.getNgram(0,2);
        assert.equal(ng.key,0);
    });
    it('should return 1 Ngram', () => {
        let seq = new Sequence();
        let e = new Element('test')
        seq.append(e);
        seq.append(e);
        let ng = seq.getNgram(1,1);
        assert.equal(ng.key,e.key);
        ng = seq.getNgram(2,1);
        assert.equal(ng.key,e.key);
        ng = seq.getNgram(2,2);
        assert.equal(ng.key,e.key+e.key);
    });
  });
});
