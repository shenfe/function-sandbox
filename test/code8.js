function () {
    a = b + 1;
    console.log(c);
    $;
    function f() {
        console.log(d);
        console.log(e);
        console.log(window);
        console.log(global);
        eval('console.log("using eval()")');
        (new Function('console.log("using new Function()")'))();
    }
    var F = f.constructor;
    (new F('console.log("using new Function()")'))();
    var d = 1;
    return f();
}