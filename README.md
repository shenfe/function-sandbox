# function-sandbox <a href="https://www.npmjs.com/package/function-sandbox"><img src="https://img.shields.io/npm/v/function-sandbox.svg"></a>

📦 Make a sandbox for a function, blocking outer-scoped variables (e.g. `window`, `global`) and dangerious operations (e.g. `eval()`, `new Function()`).

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

### example

```js
const fnsb = require('function-sandbox');

let f1 = function (b) {
    a = b + 1;
//  ^
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
    var F = f.constructor; // pointing to `Function.prototype.constructor`
    (new F('console.log("using new Function()")'))();
//       ^
    var d = 1;
    return f();
};

let f2 = fnsb(f1, true); // `f2` is function
f2(); // => undefined 1 undefined {} {}
let f3 = fnsb(f1); // `f3` is string
```

Now `f3` is such a **string** of a function:

```
"function (b) {
    var window = {}, global = {}, process = {}, Function = function () {
            return function () {
            };
        }, eval = function () {
        }, a, c, e;
    ... Here is the same body of the original function ...
}"
```

### options

The second parameter can be either Boolean or Object. When it is `true`, the main function will return a function instead of a string. When it is an object, it has several properties to be set:

| property | value |
| :---: | :--- |
| asFunction | Boolean, whether to return a function or a string. |
| whiteList | Array, a list of variable names not to be blocked. |

## More

* The [Function](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.2) in JavaScript.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright © 2018-present, [shenfe](https://github.com/shenfe)
