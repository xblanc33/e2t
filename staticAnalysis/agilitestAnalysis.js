const fs = require('fs');
const xml2js = require('xml2js');

const Event = require('./Event.js').Event;
const Sequence = require('./Sequence.js').Sequence;
const SequenceSuite = require('./SequenceSuite.js').SequenceSuite;

var parser = new xml2js.Parser();
var suite = [];
var directory = process.argv[2] || (__dirname + '/ats');

const DEPTH = 0;
//const PROBA_OF_UNKNOWN = 0.000001;
const PROBA_OF_UNKNOWN = 0;


async function readFiles() {
    let files = fs.readdirSync(directory);
    files.forEach( async file => {
        let data = fs.readFileSync(directory+'/'+file);
        let result = await parse(data);
        
        let eventList = []
        result.ats.actions[0].action.forEach(action => {
            eventList.push(createEventFromXML(action));
        });
        suite.push(new Sequence(eventList, file));
    });
}

function createEventFromXML(action) {
    let type = action.$.type;
    let value = action.value;
    let channelName = undefined;
    if (action.channel[0].$) {
        channelName = action.channel[0].$.name;
    }
    let elementTag = undefined;
    let elementCriteria = undefined;
    if (action.element && action.element[0]) {
        elementTag = action.element[0].$.tag;
        elementCriteria = action.element[0].criterias[0];
    }
    //return new Element(type+value+channelName+elementTag+elementCriteria);
    return new Event(type+value+elementTag+elementCriteria);
}

function parse(data) {
    return new Promise(function(resolve, reject) {
        parser.parseString(data, function(err, result){
            if(err){
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

(async function(){
    await readFiles();
    let sequenceSuite = new SequenceSuite(suite, DEPTH, PROBA_OF_UNKNOWN);
    let ranking = sequenceSuite.rank(); 
    console.log(`Analysis of ${ranking.length} logs (Infinity means original):`);
    let nbOfOriginal = 0;
    ranking.forEach(ranked => {
        if (ranked.crossEntropy === Infinity) nbOfOriginal++;
        console.log(`File ${ranked.sequence.name} : ${ranked.crossEntropy}`);
    })
    console.log(`${(100*nbOfOriginal  / ranking.length)}% are originals (saturation is below 33%)`);
})();
