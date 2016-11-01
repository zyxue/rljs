// syntactic sugar function for getting default parameter values
export let getopt = function(opt, field_name, default_value) {
    if (typeof opt === 'undefined') {
        return default_value;
    }
    return (typeof opt[field_name] !== 'undefined') ? opt[field_name] : default_value;
};

export let setConst = function(arr, c) {
    for (let i = 0, n = arr.length; i < n; i++) {
        arr[i] = c;
    }
};

// Utility fun
export let assert = function assert(condition, message) {
    console.log(condition);

    // from http://stackoverflow.com/questions/15313418/javascript-assert
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            console.log(message);
            throw new Error(message);
        }
        throw message; // Fallback
    }
};

export let sampleWeighted = function(p) {
    console.log(p);
    let r = Math.random();
    let c = 0.0; // cumulative prob
    for (let i = 0, n = p.length; i < n; i++) {
        c += p[i];
        if (c >= r) {
            return i;
        }
    }
    // assert(false) may happen if sum(p) < 1;
    assert(false, 'wtf');
};

export let zeros = function(n) {
    if (typeof(n) === 'undefined' || isNaN(n)) {
        return [];
    }
    if (typeof ArrayBuffer === 'undefined') {
        // lacking browser support
        let arr = new Array(n);
        for (let i = 0; i < n; i++) {
            arr[i] = 0;
        }
        return arr;
    } else {
        return new Float64Array(n);
    }
};
