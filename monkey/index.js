const Monkey = require('./Monkey.js');
const optionDefinitions = [
    { name: 'headless', alias: 'h', type: Boolean},
    { name: 'slowmo', alias: 's', type: Number, defaultOption: 200},
    { name: 'depth', alias: 'd', type: Number, defaultOption: 3},
    { name: 'proba', alias: 'p', type: Number, defaultOption: 0.000001},
];
const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

const m = new Monkey(options);

(async () => {
    await m.init();
    await m.start();
})();

