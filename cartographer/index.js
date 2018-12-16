const Calculator = require('./Calculator');
const URL = {
    MONGO :'localhost',
    RABBIT : 'localhost'
}

(async () => {
    new Calculator(URL).start();
})();