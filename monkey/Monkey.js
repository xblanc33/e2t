const puppeteer = require('puppeteer');
let axios = require('axios');
const BASE_URL = 'http://localhost:3000';
const URL = 'http://localhost:8080';

const CLOSE_PAGE_AFTER = 1000; 
const HEADLESS = false;
const SLOW_MOTION = 100;
const DEPTH = 3;
const PROBA = 0.000001; //Gives entropy of 19 
//const PROBA = 0.001; //Gives entropy of 10 


class Monkey {
    constructor(options) {
        this.options = options;
        if (!this.options.headless) this.options.headless = HEADLESS;
        if (!this.options.slowmo) this.options.slowmo = SLOW_MOTION;
        if (!this.options.depth) this.options.depth = DEPTH;
        if (!this.options.proba) this.options.proba = PROBA;

    }

    async init() {
        this.browser = await puppeteer.launch({slowMo : this.options.slowmo, headless : this.options.headless});
        this.page = await this.browser.newPage();
    }

    async start() {
        await this.createCampaign();
        await this.fetch();
        while (true) {
            for (let index = 0; index < CLOSE_PAGE_AFTER; index++) {
                await this.explore();
            }
            this.page.close();
            this.page = await this.browser.newPage();
        }
    }

    async createCampaign() {
        let creationResp = await axios.post(`${BASE_URL}/api/campaign`, {options: {
            depth: this.options.depth,
            proba: this.options.proba
        }});
        if (creationResp.status === 201) {
            this.campaignId = creationResp.data.campaignId;
            console.log(`campaign created : ${this.campaignId}`);
        }
        if (creationResp.status === 501) {
            throw new Exception('501: Cannot create campaign');
        }
        let joinResp = await axios.put(`${BASE_URL}/api/campaign/${this.campaignId}`);
        if (joinResp.status === 200) {
            this.userId = joinResp.data.userId;
            console.log(`userId : ${this.userId}`);
        }
        if (creationResp.status === 500) {
            throw new Exception('501: Cannot join campaign');
        }
        
    }

    async fetch() {
        await this.page.goto(URL);
        this.hrefs = await this.page.evaluate( () => {
            var hrefs = [];
            var aLinks = document.getElementsByTagName('a');
            for (var i = 0; i < aLinks.length; i++) {
                if (aLinks[i].href) {
                    hrefs.push(
                        {
                            type: 'click',
                            selector : computeSelector(aLinks[i]),
                            value : 'click'
                        }
                    );
                }
            }
            return hrefs;

            function computeSelector(el) {
                var names = [];
                while (el.parentNode) {
                    if (el.id) {
                        names.unshift(`#${el.id}`);
                        break;
                    } else {
                        if (el == el.ownerDocument.documentElement)
                            names.unshift(el.tagName);
                        else {
                            for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
                            names.unshift(`${el.tagName}:nth-child(${c})`);
                        }
                        el = el.parentNode;
                    }
                }
                return names.join(' > ');
            }
        })
    }

    async explore() {
        let expedition = {};
        expedition.campaignId = this.campaignId;
        expedition.events = [];
        expedition.userId = this.userId;
        expedition.userColor = "#e6194b";
        await this.page.goto(URL);
        for (let index = 0; index <= this.options.depth; index++) {
            let hrefIndex = Math.floor(Math.random() * Math.floor(this.hrefs.length));
            await this.page.click(this.hrefs[hrefIndex].selector);
            expedition.events.push(this.hrefs[hrefIndex]);
        }
        await axios.post(`${BASE_URL}/api/expedition`, {expedition: expedition});
    }
}

module.exports = Monkey;