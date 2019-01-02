const assert = require('chai').assert;
const EntropyCampaignManager = require('../EntropyCampaignManager');

describe('EntropyCampaignManager', () => {
  describe('#constructor()', () => {
    it('should throw an exception if no hash is provided', () => {
        try {
            let manager = new EntropyCampaignManager();
            assert.fail();
        } catch (e) {
        }
    });
    it('should create a EntropyCampaignMaanger with : a campaignId, a DEPTH and a PROBA_OF_UNKNOWN', () => {
        let manager = new EntropyCampaignManager(createCampaign());
        assert.equal(manager.campaignId,1);
        assert.equal(manager.DEPTH,4);
        assert.equal(manager.PROBA_OF_UNKNOWN,0.1);
        assert.instanceOf(manager.ngramMap,Map);
    });
  });
  describe('#createPreviousEventSeq()', () => {
    it('should create empty sub sequences', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        let manager = new EntropyCampaignManager(campaign);
        let previousEventSeq = manager.createPreviousEventSeq(expedition.one.events, 0, 2);
        assert.sameDeepOrderedMembers(previousEventSeq,[]);
    });
    it('should create [a,b]', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        let manager = new EntropyCampaignManager(campaign);
        let previousEventSeq = manager.createPreviousEventSeq(expedition.one.events, 2, 2);
        let expected = [];
        expected.push(expedition.one.events[0]);
        expected.push(expedition.one.events[1]);
        assert.sameDeepOrderedMembers(previousEventSeq,expected);
    });
    it('should create [b,c]', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        let manager = new EntropyCampaignManager(campaign);
        let previousEventSeq = manager.createPreviousEventSeq(expedition.one.events, 3, 2);
        let expected = [];
        expected.push(expedition.one.events[1]);
        expected.push(expedition.one.events[2]);
        assert.sameDeepOrderedMembers(previousEventSeq,expected);
    });
  });
  describe('#computeProbability()', () => {
      it('should return PROBA_OF_UNKNOWN', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        let manager = new EntropyCampaignManager(campaign);
        let proba = manager.computeProbability(expedition.one.events, expedition.one.events[0]);
        assert.equal(proba, campaign.probaOfUnknown);
      });
      it('should return 1-PROBA_OF_UNKNOWN', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.one.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        manager.updateModel(expedition.one);
        let nextItem = expedition.one.events[4];
        let proba = manager.computeProbability(expedition.one.events.slice(0,4), nextItem);
        assert.equal(proba, 1 - campaign.probaOfUnknown);
      });
      it('should return PROBA_OF_UNKNOWN', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.one.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        manager.updateModel(expedition.one);
        let nextItem = expedition.one.events[4];
        let proba = manager.computeProbability(expedition.one.events, nextItem);
        assert.equal(proba, campaign.probaOfUnknown);
      });
  });
  describe('#updateModel()', () => {
      it('should throw an exception', () => {
          try {
            let campaign = createCampaign();
            let expedition = createExpedition();
            let manager = new EntropyCampaignManager(campaign);
            manager.updateModel(expedition.one);
            assert.fail();
          } catch (ex) {
          }
      });
      it('should add 5 Ngram to the map', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.one.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        manager.updateModel(expedition.one);
        assert.equal(manager.ngramMap.size, 5);
      });
      it('should add 5 Ngram to the map', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.one.campaignId = campaign.campaignId;
        expedition.two.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        manager.updateModel(expedition.one);
        manager.updateModel(expedition.two);
        assert.equal(manager.ngramMap.size, 5);
      })
  });
  describe('#updateProbability()', () => {
      it ('should update the probability of the last event', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.one.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        let previousSeq = expedition.one.events.slice(0,4);
        let lastEvent = expedition.one.events[4];
        let proba = manager.computeProbability(previousSeq, lastEvent);
        assert.equal(proba, campaign.probaOfUnknown);
        manager.updateModel(expedition.one);
        proba = manager.computeProbability(previousSeq, lastEvent);
        assert.equal(proba, 1 - campaign.probaOfUnknown);
      });
  });
  describe('#crossEntropy()', () => {
    it ('should throw exception if expedition dos not target the same id', () => {
        try {
            let campaign = createCampaign();
            let expedition = createExpedition();
            let manager = new EntropyCampaignManager(campaign);
            manager.crossEntropy(expedition.one);
            assert.fail();
        } catch(ex) {
        } 
    });
    it ('should compute crossEntropy with all right', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.one.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        manager.updateModel(expedition.one);
        let crossEnt = manager.crossEntropy(expedition.one);
        let right = 1 - campaign.probaOfUnknown;
        let expected = - (5 * Math.log2(right)) / 5;
        assert.equal(crossEnt, expected);
    });
    it ('should compute crossEntropy with one wrong', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.one.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        manager.updateModel(expedition.one);
        expedition.two.campaignId = campaign.campaignId;
        let crossEnt = manager.crossEntropy(expedition.two);
        let right = 1 - campaign.probaOfUnknown;
        let wrong = campaign.probaOfUnknown;
        let expected = - (4 * Math.log2(right) + Math.log2(wrong)) / 5;
        assert.equal(crossEnt, expected);
    });
    it ('should compute crossEntropy with all wrong', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.one.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        manager.updateModel(expedition.one);
        expedition.three.campaignId = campaign.campaignId;
        let crossEnt = manager.crossEntropy(expedition.three);
        let wrong = campaign.probaOfUnknown;
        let expected = - (10 * Math.log2(wrong)) / 10;
        assert.equal(crossEnt, expected);
    });
  });
});

function createCampaign() {
    return {
        campaignId : 1,
        depth : 4,
        probaOfUnknown : 0.1
    }
}

function createExpedition() {
    let a = {
        type : 'click',
        selector : 'DIV > A'
    };
    let b = {
        type : 'click',
        selector : 'A'
    }
    let c = {
        type : 'blur',
        selector : 'DIV'
    };
    let d = {
        type : 'fill',
        selector : 'FORM'
    };
    let e = {
        type : 'click',
        selector : 'DIV > DIV > A'
    };
    let f = {
        type : 'hover',
        selector : '#here'
    }
    
    return {
        one : {
            events: [a,b,c,d,e]
        },
        two : {
            events: [a,b,c,d,c]
        },
        three : {
            events: [f,f,f,f,f,f,f,f,f,f]
        }
    }
}