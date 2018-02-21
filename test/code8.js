function () {
    a = b + 1;
    console.log(c);
    function inner() {
        console.log(d);
        console.log(e);
        console.log(window);
        console.log(global);
        // eval('console.log("using eval")');
    }
    var d = 1;
    return inner();
}