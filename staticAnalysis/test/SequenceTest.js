const assert = require('chai').assert;
const Sequence = require('../Sequence.js').Sequence;
const Event = require('../Event.js').Event;

describe('Sequence', function() {
  describe('#constructor()', function() {
    it('should create an empty sequence', () => {
        let seq = new Sequence();
        assert.equal(seq.length, 0);
        assert.isTrue(Array.isArray(seq.eventList));
        assert.equal(seq.eventList.length, 0);
    });
    it('should create a sequence of events', () => {
        let e = new Event('hey');
        let seq = new Sequence([e,e,e]);     
        assert.equal(seq.length, 3);
        assert.isTrue(Array.isArray(seq.eventList));
        assert.equal(seq.eventList.length, 3);
    });
  });
  describe('#append()', function() {
    it('should throw an exception with undefined event', () => {
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
    it('should throw an exception with not an Event', () => {
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
        let e = new Event('test')
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
