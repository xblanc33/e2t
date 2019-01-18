const Monkey = require('./Monkey.js');

let expeditionLength = process.argv[2];

const m = new Monkey(expeditionLength);

(async () => {
    await m.init();
    await m.start();
})();

