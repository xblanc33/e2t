import CssSelectGenerator from 'css-selector-generator';

export default class CssSelectorGenerator {

    constructor() {
        this.generator = new CssSelectGenerator;
    }

    generate(el) {
        return this.generator.getSelector(el);
    }

}

