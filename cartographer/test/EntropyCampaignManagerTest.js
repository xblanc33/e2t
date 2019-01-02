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
        assert.equal(manager.PROBA_OF_UNKNOWN,0.4);
        assert.instanceOf(manager.ngramMap,Map);
    });
  });
  describe('#createPreviousEventSeq()', () => {
    it('should create empty sub sequences', () => {
        let campaign = createCampaign();
        let expedition = createExpedition();
        expedition.campaignId = campaign.campaignId;
        let manager = new EntropyCampaignManager(campaign);
        let previousEventSeq = manager.createPreviousEventSeq(expedition.one, 0, 2);
        assert.sameDeepOrderedMembers(previousEventSeq,[]);

    });

  })
});

function createCampaign() {
    return {
        campaignId : 1,
        depth : 4,
        probaOfUnknown : 0.4
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
        selector : ''
    };
    let d = {
        type : 'fill',
        selector : 'FORM'
    };
    let e = {
        type : 'click',
        selector : 'DIV > DIV > A'
    };
    
    return {
        one : [a,b,c,d,e],
        two : [a,b,d,e,c],
        three : [b,d,e,c,a]
    }
}