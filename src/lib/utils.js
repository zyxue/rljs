import R from './r';

// syntactic sugar function for getting default parameter values
export let getopt = function(opt, field_name, default_value) {
    if (typeof opt === 'undefined') {
        return default_value;
    }
    return (typeof opt[field_name] !== 'undefined') ? opt[field_name] : default_value;
};

export let setConst = function(arr, c) {
    for (var i = 0, n = arr.length; i < n; i++) {
        arr[i] = c;
    }
};


export let sampleWeighted = function(p) {
    console.log(p);
    var r = Math.random();
    var c = 0.0; // cumulative prob
    for (var i = 0, n = p.length; i < n; i++) {
        c += p[i];
        if (c >= r) {
            return i;
        }
    }
    // assert(false) may happen if sum(p) < 1;
    R.assert(false, 'wtf');
};
