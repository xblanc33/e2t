const assert = require('chai').assert;
const Element = require('../Element.js').Element;

describe('Element', function() {
  describe('#constructor()', function() {
    it('should throw an exception with undefined value', () => {
        try  {
            let e = new Element(undefined);
            assert.fail();
        } catch (ex) {

        }
    });
    it('should throw an exception with null value', () => {
        try  {
            let e = new Element(null);
            assert.fail();
        } catch (ex) {

        }
    });
    it('should hash empty', () => {
        let e = new Element('');
        assert.equal(e.key,0);
    });
    it('should create different hash', () => {
        let e1 = new Element('hey');
        let e2 = new Element('hue');
        assert.notEqual(e1.key,e2.key);
    });
    it('should create same hash', () => {
        let e1 = new Element('hey');
        let e2 = new Element('hey');
        assert.equal(e1.key,e2.key);
    });
  });
});
