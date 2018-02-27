const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const escope = require('escope');

const globalObjects = {
    'console': 0,
    'setTimeout': 0,
    'setInterval': 0,
    'Object': 0,
    'Boolean': 0,
    'String': 0,
    'Number': 0,
    'Date': 0,
    'parseInt': 0,
    'parseFloat': 0,
    'Math': 0,
    'Promise': 0,
    'window': '{}',
    'global': '{}',
    'process': '{}',
    'Function': 'function () { return function () {} }',
    // 'eval': 'function () {}'
};

const insertBefore = (arr, arr1) => {
    arr1.reverse().forEach(item => arr.unshift(item));
    return arr;
};

const createVarDeclaration = (vars = []) => {
    if (!vars.length) return [];
    const code = `'use strict'; var ${vars.join(', ')};`;
    return esprima.parse(code).body;
};

const ObjectStringify = obj => {
    switch (Object.prototype.toString.call(obj)) {
    case '[object Function]':
    case '[object AsyncFunction]':
    case '[object GeneratorFunction]':
        return main(obj.toString());

    case '[object Object]':
        let p = [];

        for (let i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            p.push([i, ObjectStringify(obj[i])]);
        }

        return '{' + p.map(v => `${JSON.stringify(v[0])}:${v[1]}`).join(',') + '}';

    case '[object Array]':
        return '[' + obj.map(ObjectStringify).join(',') + ']';

    default:
        return JSON.stringify(obj);
    }
};

/* Hide the `Function` constructor */
Function = Function.prototype.constructor;
Function.prototype.constructor = function () { return function () {} };

const main = function (code = '', options = {}) {
    if (typeof code === 'function') {
        code = code.toString();
    }
    let ast;
    try {
        ast = esprima.parse(code);
    } catch (e) {
        ast = esprima.parse('const targetFn = ' + code);
    }

    if (!options) options = {};
    const whiteList = {};
    const injection = {};
    if (typeof options === 'object') {
        if (Array.isArray(options.whiteList)) {
            options.whiteList.forEach(x => {
                whiteList[x] = 1;
            });
        }
        if (typeof options.injection === 'object' && options.injection) {
            Object.assign(injection, options.injection);
        }
    }

    const scopeManager = escope.analyze(ast, {
        ignoreEval: true
    });
    let currentScope = scopeManager.acquire(ast); // global scope
    let rootFunction;
    const varsThrough = {};

    let patternInParam = false;

    estraverse.traverse(ast, {
        enter: function (node, parent) {
            // do stuff
            if (/Function/.test(node.type)) {
                currentScope = scopeManager.acquire(node); // get current function scope
                if (!rootFunction) {
                    rootFunction = currentScope;
                }
            }
        },
        leave: function (node, parent) {
            if (/Function/.test(node.type)) {
                currentScope = currentScope.upper; // set to parent scope
                if (currentScope.type === 'global') {
                    if (rootFunction.block.params.findIndex(p => p.type.includes('Pattern')) >= 0) {
                        patternInParam = true;
                    }
                    if (patternInParam) return;
                    rootFunction.through
                        .map(id => id.identifier.name)
                        .filter(id => !globalObjects.hasOwnProperty(id) && !whiteList.hasOwnProperty(id) && !injection.hasOwnProperty(id))
                        .forEach(id => {
                            varsThrough[id] = 1;
                        });
                }
            }
            // do stuff
        }
    });

    let re = 'function () {}';

    if (!patternInParam && rootFunction) {
        insertBefore(rootFunction.block.body.body, createVarDeclaration(Object.keys(varsThrough)));

        re = `function () { var ${
            Object.keys(globalObjects)
                .filter(k => globalObjects[k] !== 0)
                .map(k => `${k} = ${globalObjects[k]}`)
                .concat(Object.keys(injection).filter(k => /^[a-zA-Z$_]+[0-9a-zA-Z$_]*$/.test(k)).map(k => {
                    return `${k} = ${ObjectStringify(injection[k])}`;
                }))
                .join(', ')
        }; return (${escodegen.generate(rootFunction.block)}).apply(null, arguments); }`;
    }

    if (options === true || options.asFunction) {
        return (new Function('return ' + re))();
    }
    return re;
};

module.exports = main;
