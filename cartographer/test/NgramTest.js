const assert = require('chai').assert;
const Ngram = require('../Ngram');

describe('Ngram', function() {
  describe('#constructor()', function() {
    it('should throw an exception if no hash is provided', () => {
        try {
            let ngram = new Ngram();
            assert.fail();
        } catch (e) {
        }
    });
    it('should create a Ngram with : a hash, 0 size and a successorMap', () => {
        let ngram = new Ngram(1);
        assert.equal(ngram.size,0);
        assert.equal(ngram.hash,1);
        assert.instanceOf(ngram.successorMap,Map);
    });
    it('should create a Ngram with : a hash, 0 size and a successorMap', () => {
        let ngram = new Ngram(0);
        assert.equal(ngram.size,0);
        assert.equal(ngram.hash,0);
        assert.instanceOf(ngram.successorMap,Map);
    });
  });
  describe('#updateSuccessorOccurence()', () => {
    it('should add one successor occurence', () => {
        let ngram = new Ngram(1);
        ngram.updateSuccessorOccurence(2);
        assert.equal(ngram.size,1);
    });
    it('should add two successor occurences', () => {
        let ngram = new Ngram(1);
        ngram.updateSuccessorOccurence(2);
        ngram.updateSuccessorOccurence(2);
        assert.equal(ngram.size,2);
    });
    it('should add two successor occurences', () => {
        let ngram = new Ngram(1);
        ngram.updateSuccessorOccurence(2);
        ngram.updateSuccessorOccurence(3);
        assert.equal(ngram.size,2);
    });
  });
  describe('#getSuccessorProbability()', () => {
    it('should return 1 as probability', () => {
        let ngram = new Ngram(1);
        ngram.updateSuccessorOccurence(2);
        let proba = ngram.getSuccessorProbability(2);
        assert.equal(proba,1);
    });
    it('should return 0.5 as probability', () => {
        let ngram = new Ngram(1);
        ngram.updateSuccessorOccurence(2);
        ngram.updateSuccessorOccurence(3);
        let proba = ngram.getSuccessorProbability(2);
        assert.equal(proba,0.5);
    })
    it('should return 0 as probability', () => {
        let ngram = new Ngram(1);
        ngram.updateSuccessorOccurence(2);
        let proba = ngram.getSuccessorProbability(3);
        assert.equal(proba,0);
    })
  })
});