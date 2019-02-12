const fs = require('fs');
const xml2js = require('xml2js');

const Element = require('./Element.js').Element;
const Sequence = require('./Sequence.js').Sequence;
const SequenceSuite = require('./SequenceSuite.js').SequenceSuite;

var parser = new xml2js.Parser();
var suite = [];
var directory = process.argv[2] || (__dirname + '/ats');


async function readFiles() {
    let files = fs.readdirSync(directory);
    files.forEach( async file => {
        let data = fs.readFileSync(directory+'/'+file);
        let result = await parse(data);
        
        let elementList = []
        result.ats.actions[0].action.forEach(action => {
            elementList.push(createElementFromXML(action));
        });
        suite.push(new Sequence(elementList, file));
    });
}

function createElementFromXML(action) {
    let type = action.$.type;
    let value = action.value;
    let channel = action.channel[0].$ ? action.channel[0].$.name : undefined;
    let boundX = action.channel[0].bound[0] ? action.channel[0].bound[0].x : undefined;
    let boundY = action.channel[0].bound[0] ? action.channel[0].bound[0].y : undefined;
    return new Element(type+value+channel+boundX+boundY);
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
    let sequenceSuite = new SequenceSuite(suite);
    let ranking = sequenceSuite.rank(); 
    console.log(`Analysis of ${ranking.length} logs (Infinity means original):`);
    let nbOfOriginal = 0;
    ranking.forEach(ranked => {
        if (ranked.crossEntropy === Infinity) nbOfOriginal++;
        console.log(`File ${ranked.sequence.name} : ${ranked.crossEntropy}`);
    })
    console.log(`${(100*nbOfOriginal  / ranking.length)}% are originals (saturation is below 33%)`);
})();
