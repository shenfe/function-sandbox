const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const escope = require('escope');

const whiteList = {
    'console': 1
};

const createVarDeclaration = vars => {
    const code = `var ${vars.join(', ')};`;
    return esprima.parse(code).body[0];
};

const main = function (code = '', options = {}) {
    let ast;
    try {
        ast = esprima.parse(code);
    } catch (e) {
        ast = esprima.parse('const targetFn = ' + code);
    }

    const scopeManager = escope.analyze(ast);
    let currentScope = scopeManager.acquire(ast);   // global scope
    let rootFunction;
    const varsThrough = {};

    estraverse.traverse(ast, {
        enter: function (node, parent) {
            // do stuff

            if (/Function/.test(node.type)) {
                currentScope = scopeManager.acquire(node);  // get current function scope
                if (!rootFunction) {
                    rootFunction = currentScope;
                }
            }
        },
        leave: function (node, parent) {
            if (/Function/.test(node.type)) {
                currentScope = currentScope.upper;  // set to parent scope
                if (currentScope.type === 'global') {
                    currentScope.through
                        .map(id => id.identifier.name)
                        .filter(id => !whiteList[id])
                        .forEach(id => {
                            varsThrough[id] = 1;
                        });
                }
            }

            // do stuff
        }
    });

    let vars = Object.keys(varsThrough);
    vars.length && rootFunction && rootFunction.block.body.body.unshift(createVarDeclaration(vars));
    if (rootFunction) {
        return escodegen.generate(rootFunction.block);
    }
    return '';
};

module.exports = main;