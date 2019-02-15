const assert = require('chai').assert;
const Event = require('../Event.js').Event;

describe('Event', function() {
  describe('#constructor()', function() {
    it('should throw an exception with undefined value', () => {
        try  {
            let e = new Event(undefined);
            assert.fail();
        } catch (ex) {

        }
    });
    it('should throw an exception with null value', () => {
        try  {
            let e = new Event(null);
            assert.fail();
        } catch (ex) {

        }
    });
    it('should hash empty', () => {
        let e = new Event('');
        assert.equal(e.key,0);
    });
    it('should create different hash', () => {
        let e1 = new Event('hey');
        let e2 = new Event('hue');
        assert.notEqual(e1.key,e2.key);
    });
    it('should create same hash', () => {
        let e1 = new Event('hey');
        let e2 = new Event('hey');
        assert.equal(e1.key,e2.key);
    });
  });
});
