const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const escope = require('escope');

const globalObjects = {
    'console': 0,
    'window': '{}',
    'global': '{}',
    'process': '{}',
    'Function': 'function () {}',
    'eval': 'function () {}'
};

const insertBefore = (arr, arr1) => {
    arr1.reverse().forEach(item => arr.unshift(item));
    return arr;
};

const createVarDeclaration = (vars = []) => {
    if (!vars.length) return [];
    const code = `var ${vars.join(', ')};`;
    return esprima.parse(code).body;
};

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

    const scopeManager = escope.analyze(ast);
    let currentScope = scopeManager.acquire(ast);   // global scope
    let rootFunction;
    const varsThrough = {};

    let patternInParam = false;

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
                    if (rootFunction.block.params.findIndex(p => p.type.includes('Pattern')) >= 0) {
                        patternInParam = true;
                    }
                    if (patternInParam) return;
                    rootFunction.through
                        .map(id => id.identifier.name)
                        .filter(id => !globalObjects.hasOwnProperty(id))
                        .forEach(id => {
                            varsThrough[id] = 1;
                        });
                }
            }

            // do stuff
        }
    });

    let vars = Object.keys(varsThrough);

    let re = 'function () {}';

    if (!patternInParam && rootFunction) {
        insertBefore(rootFunction.block.body.body, createVarDeclaration(vars));
        let globalVars = Object.keys(globalObjects)
            .filter(k => globalObjects[k] !== 0)
            .map(k => `${k} = ${globalObjects[k]}`);
        re = `(function () { var ${globalVars.join(', ')}; return (${escodegen.generate(rootFunction.block)}); })()`;
    }

    if (options === true || options.asFunction) {
        return (new Function('return ' + re))();
    }
    return re;
};

module.exports = main;