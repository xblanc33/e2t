const assert = require('chai').assert;
const Ngram = require('../Ngram.js').Ngram;
const Event = require('../Event.js').Event;

describe('Ngram', function() {
  describe('#constructor()', function() {
    it('should throw an exception with undefined eventList', () => {
        try  {
            let ng = new Ngram(undefined);
            assert.fail();
        } catch (ex) {

        }
    });
    it('should throw an exception with null item', () => {
        try  {
            let ng = new Ngram(null);
            assert.fail();
        } catch (ex) {

        }
    });
    it('should throw an exception with not an Array', () => {
        try  {
            let ng = new Ngram("hey");
            assert.fail();
        } catch (ex) {

        }
    });
    it('should throw an exception with not an Array of Event', () => {
        try  {
            let ng = new Ngram([1,2,3]);
            assert.fail();
        } catch (ex) {

        }
    });
    it('should hash empty', () => {
        let ng = new Ngram([]);
        assert.equal(ng.key,0);
    });
    it('should hash Event', () => {
        let e = new Event('this is my event');
        let ng = new Ngram([e]);
        assert.equal(ng.key,e.key);
    });
    it('should hash Event', () => {
        let e = new Event('this is my event');
        let ng = new Ngram([e,e]);
        assert.equal(ng.key,e.key+e.key);
    });
  });
});
