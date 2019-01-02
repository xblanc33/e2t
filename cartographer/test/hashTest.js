const assert = require('chai').assert;

const hashItem = require('../hash.js').hashItem;
const hashNGram = require('../hash.js').hashNGram;


describe('hash', function() {
  describe('#hashItem()', function() {
    it('should hash empty', () => {
        let hash = hashItem({type:'',selector:''});
        assert.equal(hash,0);
    });
    it('should create different hash', () => {
        let itemSeq = createExpedition();
        let hash0 = hashItem(itemSeq[0]);
        let hash1 = hashItem(itemSeq[1]);
        assert.notDeepEqual(hash0,hash1);
    });
    it('should create same hash', () => {
        let itemSeq = createExpedition();
        let hash0 = hashItem(itemSeq[0]);
        let hash1 = hashItem(itemSeq[0]);
        assert.deepEqual(hash0,hash1);
    });
  });
  describe('#hashNgram()', function() {
    it('should create different hash', () => {
        let itemSeq = createExpedition();
        assert.isArray(itemSeq);
        let hash0 = hashNGram(itemSeq);
        let hash1 = hashNGram(itemSeq.slice(0,1));
        assert.notDeepEqual(hash0,hash1);
    });
    it('should create same hash', () => {
        let itemSeq = createExpedition();
        let hash0 = hashNGram(itemSeq);
        let hash1 = hashNGram(itemSeq);
        assert.deepEqual(hash0,hash1);
    });
  });
});


function createExpedition() {
    let item1 = {
        type : 'click',
        selector : 'DIV > A'
    };
    let item2 = {
        type : 'click',
        selector : 'A'
    }
    let item3 = {
        type : 'blur',
        selector : ''
    };
    
    return [item1,item2,item3];
}