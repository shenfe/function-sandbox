function () {
    a = b + 1;
    console.log(c);
    function f() {
        console.log(d);
        console.log(e);
        console.log(window);
        console.log(global);
        // eval('console.log("using eval")');
    }
    var d = 1;
    return f();
}