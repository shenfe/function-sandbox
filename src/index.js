const acorn = require('acorn');
const walk = require('acorn/dist/walk');

const main = function (code = '', options = {}) {
    const ast = acorn.parseExpressionAt(code, 0, options);
    walk.simple(ast, {
        FunctionExpression(node) {
            debugger
        },
        ArrowFunctionExpression(node) {
            debugger
        },
        Function(node) {
            debugger
        }
    });
};

module.exports = main;