const fnsb = require('../src');

const fs = require('fs');
const path = require('path');

const readFile = fp =>
    fs.readFileSync(path.resolve(process.cwd(), `test/${fp}`), 'utf8');

const code1 = readFile('code1.js');
const result1 = fnsb(code1);
const code2 = readFile('code2.js');
const result2 = fnsb(code2);
const code3 = readFile('code3.js');
const result3 = fnsb(code3);
const code4 = readFile('code4.js');
const result4 = fnsb(code4);
const code5 = readFile('code5.js');
const result5 = fnsb(code5);
const code6 = readFile('code6.js');
const result6 = fnsb(code6);
