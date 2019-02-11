const Ngram = require('./Ngram.js').Ngram;
const Element = require('./Element.js').Element;

class Sequence {
    constructor(elementList, name) {
        this.name = name;
        if (elementList === null || elementList === undefined) {
            this.elementList = [];
            this.length = 0;
        } else {
            if (! Array.isArray(elementList)) {
                throw 'Cannot create sequence with Array.isArray(elementList) === false';
            }
            elementList.forEach(element => {
                if (!(element instanceof Element)) {
                    throw 'Cannot create sequence with array containing a not Element'
                }
            })
            this.elementList = elementList;
            this.length = elementList.length;
        }
    }

    append(element) {
        if (element == null || element == undefined) {
            throw 'cannot append null or undefined';
        }
        if (!(element instanceof Element)) {
            throw 'cannot append element not Element';
        }
        this.elementList.push(element);
        this.length++;
    }

    getNgram(beforeIndex, ngramSize) {
        let ngramElementList = [];
        if (beforeIndex > 0) {
            let from = Math.max(0,beforeIndex - ngramSize);
            for (let previousIndex = from; previousIndex < beforeIndex; previousIndex++) {
                ngramElementList.push(this.elementList[previousIndex]);
            }
        }
        return new Ngram(ngramElementList);
    }
}

module.exports.Sequence = Sequence;