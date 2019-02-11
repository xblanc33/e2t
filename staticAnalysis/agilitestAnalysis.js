const fs = require('fs');
const xml2js = require('xml2js');

const Element = require('./Element.js').Element;
const Sequence = require('./Sequence.js').Sequence;
const SequenceSuite = require('./SequenceSuite.js').SequenceSuite;

var parser = new xml2js.Parser();
var suite = [];


async function readFiles() {
    for (let index = 1; index <= 5; index++) {
        let data = fs.readFileSync(__dirname + `/ats/actions.${index}.xml`);
        let result = await parse(data);
        
        let elementList = []
        result.ats.actions[0].action.forEach(action => {
            let type = action.$.type;
            let value = action.value;
            let channel = action.channel[0].$ ? action.channel[0].$.name : undefined;
            let boundX = action.channel[0].bound[0] ? action.channel[0].bound[0].x : undefined;
            let boundY = action.channel[0].bound[0] ? action.channel[0].bound[0].y : undefined;
            elementList.push(new Element(type+value+channel+boundX+boundY));
        });
        suite.push(new Sequence(elementList, `actions.${index}.xml`));
    }
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
    ranking.forEach(ranked => {
        console.log(`${ranked.sequence.name} : ${ranked.crossEntropy}`);
    })
})();
