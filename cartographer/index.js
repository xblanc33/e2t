const Cartographer = require('./Cartographer');
const URL = {
    MONGO :'mongo',
    RABBIT : 'rabbit'
};
const ENTROPY_OPTION = {
    PROBA_OF_UNKNOWN : 0.1,
    DEPTH : 3
};

(async() => {
    new Cartographer(URL, ENTROPY_OPTION).start();
})();