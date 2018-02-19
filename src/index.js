const acorn = require('acorn');
const walk = require('acorn/dist/walk');

const main = function (code = '', options = {}) {
    let ast;
    try {
        ast = acorn.parse(code, options);
    } catch (e) {
        ast = acorn.parseExpressionAt(code, 0, options);
    }
    walk.simple(ast, {
        FunctionDeclaration(node) {
            // debugger
        },
        FunctionExpression(node) {
            // debugger
        },
        ArrowFunctionExpression(node) {
            // debugger
        },
        Function(node) {
            debugger
        },
        ObjectPattern(node) {
            // debugger
        },
        RestElement(node) {
            // debugger
        },
        Identifier(node) {
            // debugger
        },
        VariableDeclaration(node) {
            // debugger
        }
    });
};

module.exports = main;