const puppeteer = require('puppeteer');
let axios = require('axios');
const BASE_URL = 'http://localhost:3000';
const URL = 'http://localhost:8080';
const SLOW_MOTION = 400;

class Monkey {
    constructor(explorationLength) {
        this.explorationLength = explorationLength;
    }

    async init() {
        this.browser = await puppeteer.launch({sloMo : SLOW_MOTION});
        this.page = await this.browser.newPage();
    }

    async start() {
        await this.createCampaign();
        await this.fetch();
        while (true) {
            await this.explore();
        }
    }

    async createCampaign() {
        let response = await axios.post(`${BASE_URL}/api/campaign`, {options: {
            depth: 2,
            proba: 0.001
        }});
        if (response.status === 201) {
            this.campaignId = response.data.campaignId;
            console.log(`campaign created : ${this.campaignId}`);
        }
        if (response.status === 501) {
            throw new Exception('501: Cannot create campaign');
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
        await this.page.goto(URL);
        for (let index = 0; index < this.explorationLength; index++) {
            let hrefIndex = Math.floor(Math.random() * Math.floor(this.hrefs.length));
            await this.page.click(this.hrefs[hrefIndex].selector);
            expedition.events.push(this.hrefs[hrefIndex]);
        }
        await axios.post(`${BASE_URL}/api/expedition`, {expedition: expedition});
    }
}

module.exports = Monkey;