# function-sandbox

<a href="https://www.npmjs.com/package/function-sandbox"><img src="https://img.shields.io/npm/v/function-sandbox.svg"></a>

📦 Make a sandbox for a function, blocking outer-scoped variables and dangerious operations such as `eval()` and `new Function()`.

## Input/Output

### input

A function or string of a function.

### output

A function or string of a function.

## Installation

```bash
$ npm install --save function-sandbox
```

## Usage

```js
const fnsb = require('function-sandbox');

let f1 = function () {
    a = b + 1;
//  ^   ^
    console.log(c);
//              ^
    function f() {
        console.log(d);
        console.log(e);
//                  ^
        console.log(window);
//                  ^
        console.log(global);
//                  ^
        eval('console.log("using eval()")');
//      ^
        (new Function('console.log("using new Function()")'))();
//           ^
    }
    var d = 1;
    return f();
};

let f2 = fnsb(f1, true); // `f2` is function
f2(); // => undefined 1 undefined {} {}
let f3 = fnsb(f1); // `f3` is string
```

Now `f3` is such a **string** of a function:

```
"(function () { var window = {}, global = {}, process = {}, Function = function () {}, eval = function () {}; return (function () {
    var a, b, c, e;
    ... Here is the same body of the original function ...
}); })()"
```

## License

MIT
