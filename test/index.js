const fnsb = require('../src');

const fs = require('fs');
const path = require('path');

const readFile = fp =>
    fs.readFileSync(path.resolve(process.cwd(), `test/${fp}`), 'utf8');

const consoleLog = x => {
    console.log(x);
};

consoleLog('code1 ******************************************************');
const code1 = readFile('code1.js');
const result1 = fnsb(code1);
consoleLog(result1);

consoleLog('code2 ******************************************************');
const code2 = readFile('code2.js');
const result2 = fnsb(code2);
consoleLog(result2);

consoleLog('code3 ******************************************************');
const code3 = readFile('code3.js');
const result3 = fnsb(code3, true);
let r3 = result3();
consoleLog(result3);

consoleLog('code4 ******************************************************');
const code4 = readFile('code4.js');
const result4 = fnsb(code4);
consoleLog(result4);

consoleLog('code5 ******************************************************');
const code5 = readFile('code5.js');
const result5 = fnsb(code5);
consoleLog(result5);

consoleLog('code6 ******************************************************');
const code6 = readFile('code6.js');
const result6 = fnsb(code6);
consoleLog(result6);

consoleLog('code7 ******************************************************');
const code7 = readFile('code7.js');
const result7 = fnsb(code7);
consoleLog(result7);

consoleLog('code8 ******************************************************');
const code8 = readFile('code8.js');
const result81 = fnsb(code8, {
    whiteList: [ '$' ]
});
consoleLog(result81);
const result82 = fnsb(code8, true);
result82();

consoleLog('code9 ******************************************************');
const code9 = readFile('code9.js');
const code9Inject = {
    b: '1',
    c: function () {
        console.log(1);
        console.log(f);
    },
    'd = window.d, e': ['d and e']
};
const result91 = fnsb(code9, {
    injection: code9Inject
});
consoleLog(result91);
const result92 = fnsb(code9, {
    asFunction: true,
    injection: code9Inject
});
result92();
