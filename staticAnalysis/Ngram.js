const Element = require('./Element.js').Element;

class Ngram {
    constructor(elementList) {
        if (elementList === null || elementList === undefined) {
            throw 'Cannot create Ngram with null or undefined elementList';
        }
        if (!Array.isArray(elementList)) {
            throw 'Cannot create Ngram with isArray(elementList) false';
        }
        elementList.forEach(element => {
            if (!(element instanceof Element)) {
                throw 'Cannot create Ngram, one element is not an Element';
            }
        })
        this.elementList = elementList;
        this.size = elementList.lenght;
        this.key = elementList.map(el => el.key).reduce((accu,cur)=>accu+cur, '');
    }
}

module.exports.Ngram = Ngram;