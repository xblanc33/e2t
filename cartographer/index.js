const Cartographer = require('./Cartographer');
const URL = {
    MONGO :'localhost',
    RABBIT : 'localhost'
};

(async() => {
    new Cartographer(URL).start();
})();