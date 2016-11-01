import {assert, zeros} from '../utils';



// Mat holds a matrix
var Mat = function(n, d) {
    // n is number of rows d is number of columns
    this.n = n;
    this.d = d;
    this.w = zeros(n * d);
    this.dw = zeros(n * d);
};

Mat.prototype = {
    get: function(row, col) {
        // slow but careful accessor function
        // we want row-major order
        var ix = (this.d * row) + col;
        assert(ix >= 0 && ix < this.w.length);
        return this.w[ix];
    },

    set: function(row, col, v) {
        // slow but careful accessor function
        var ix = (this.d * row) + col;
        assert(ix >= 0 && ix < this.w.length);
        this.w[ix] = v;
    },

    setFrom: function(arr) {
        for (var i = 0, n = arr.length; i < n; i++) {
            this.w[i] = arr[i];
        }
    },

    setColumn: function(m, i) {
        for (var q = 0, n = m.w.length; q < n; q++) {
            this.w[(this.d * q) + i] = m.w[q];
        }
    },

    toJSON: function() {
        var json = {};
        json['n'] = this.n;
        json['d'] = this.d;
        json['w'] = this.w;
        return json;
    },

    fromJSON: function(json) {
        this.n = json.n;
        this.d = json.d;
        this.w = zeros(this.n * this.d);
        this.dw = zeros(this.n * this.d);
        for (var i = 0, n = this.n * this.d; i < n; i++) {
            this.w[i] = json.w[i]; // copy over weights
        }
    }
};


export default Mat;
