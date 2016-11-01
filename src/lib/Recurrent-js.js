import {Mat} from './Recurrent-js/Mat';
import {Solver} from './Recurrent-js/Solver';
import {Graph} from './Recurrent-js/Graph';

import {zeros} from './utils';


// Random numbers utils
let gaussRandom = function(return_v = false, v_val = 0.0) {
    if (return_v) {
        return_v = false;
        return v_val;
    }
    let u = 2 * Math.random() - 1;
    let v = 2 * Math.random() - 1;
    let r = u * u + v * v;
    if (r === 0 || r > 1) return gaussRandom();
    let c = Math.sqrt(-2 * Math.log(r) / r);
    v_val = v * c; // cache this
    return_v = true;
    return u * c;
};


// let fillRand = function(m, lo, hi) { for(let i=0,n=m.w.length;i<n;i++) { m.w[i] = randf(lo, hi); } };
let gradFillConst = function(m, c) {
    for (let i = 0, n = m.dw.length; i < n; i++) {
        m.dw[i] = c;
    }
};


// the Recurrent library
var Recurrent = {
    // helper function returns array of zeros of length n
    // and uses typed arrays if available
    zeros: zeros,

    maxi: function(w) {
        // argmax of array w
        var maxv = w[0];
        var maxix = 0;
        for (var i = 1, n = w.length; i < n; i++) {
            var v = w[i];
            if (v > maxv) {
                maxix = i;
                maxv = v;
            }
        }
        return maxix;
    },
    
    samplei: function(w) {
        // sample argmax from w, assuming w are 
        // probabilities that sum to one
        var r = this.randf(0, 1);
        var x = 0.0;
        var i = 0;
        while (true) {
            x += w[i];
            if (x > r) {
                return i;
            }
            i++;
        }
        return w.length - 1; // pretty sure we should never get here?
    },

    randf: function(a, b) {
        return Math.random() * (b - a) + a;
    },

    randi: function(a, b) {
        return Math.floor(Math.random() * (b - a) + a);
    },
        
    randn: function(mu, std) {
        return mu + gaussRandom() * std;
    },

    // Mat utils
    // fill matrix with random gaussian numbers
    fillRandn: function(m, mu, std) {
        for (let i = 0, n = m.w.length; i < n; i++) {
            m.w[i] = this.randn(mu, std);
        }
    },

    softmax: function(m) {
        var out = new Mat(m.n, m.d); // probability volume
        var maxval = -999999;
        for (var i = 0, n = m.w.length; i < n; i++) {
            if (m.w[i] > maxval) maxval = m.w[i];
        }

        var s = 0.0;
        for (var i = 0, n = m.w.length; i < n; i++) {
            out.w[i] = Math.exp(m.w[i] - maxval);
            s += out.w[i];
        }
        for (var i = 0, n = m.w.length; i < n; i++) {
            out.w[i] /= s;
        }

        // no backward pass here needed
        // since we will use the computed probabilities outside
        // to set gradients directly on m
        return out;
    },

    // classes
    Mat: Mat,

    // return Mat but filled with random numbers from gaussian
    RandMat: function(n, d, mu, std) {
        var m = new Mat(n, d);
        this.fillRandn(m, mu, std);
        //fillRand(m,-std,std); // kind of :P
        return m;
    },

    forwardLSTM: function(G, model, hidden_sizes, x, prev) {
        // forward prop for a single tick of LSTM
        // G is graph to append ops to
        // model contains LSTM parameters
        // x is 1D column vector with observation
        // prev is a struct containing hidden and cell
        // from previous iteration

        if (prev == null || typeof prev.h === 'undefined') {
            var hidden_prevs = [];
            var cell_prevs = [];
            for (var d = 0; d < hidden_sizes.length; d++) {
                hidden_prevs.push(new Mat(hidden_sizes[d], 1));
                cell_prevs.push(new Mat(hidden_sizes[d], 1));
            }
        } else {
            var hidden_prevs = prev.h;
            var cell_prevs = prev.c;
        }

        var hidden = [];
        var cell = [];
        for (var d = 0; d < hidden_sizes.length; d++) {

            var input_vector = d === 0 ? x : hidden[d - 1];
            var hidden_prev = hidden_prevs[d];
            var cell_prev = cell_prevs[d];

            // input gate
            var h0 = G.mul(model['Wix' + d], input_vector);
            var h1 = G.mul(model['Wih' + d], hidden_prev);
            var input_gate = G.sigmoid(G.add(G.add(h0, h1), model['bi' + d]));

            // forget gate
            var h2 = G.mul(model['Wfx' + d], input_vector);
            var h3 = G.mul(model['Wfh' + d], hidden_prev);
            var forget_gate = G.sigmoid(G.add(G.add(h2, h3), model['bf' + d]));

            // output gate
            var h4 = G.mul(model['Wox' + d], input_vector);
            var h5 = G.mul(model['Woh' + d], hidden_prev);
            var output_gate = G.sigmoid(G.add(G.add(h4, h5), model['bo' + d]));

            // write operation on cells
            var h6 = G.mul(model['Wcx' + d], input_vector);
            var h7 = G.mul(model['Wch' + d], hidden_prev);
            var cell_write = G.tanh(G.add(G.add(h6, h7), model['bc' + d]));

            // compute new cell activation
            var retain_cell = G.eltmul(forget_gate, cell_prev); // what do we keep from cell
            var write_cell = G.eltmul(input_gate, cell_write); // what do we write to cell
            var cell_d = G.add(retain_cell, write_cell); // new cell contents

            // compute hidden state as gated, saturated cell activations
            var hidden_d = G.eltmul(output_gate, G.tanh(cell_d));

            hidden.push(hidden_d);
            cell.push(cell_d);
        }

        // one decoder to outputs at end
        var output = G.add(G.mul(model['Whd'], hidden[hidden.length - 1]), model['bd']);

        // return cell memory, hidden representation and output
        return {
            'h': hidden,
            'c': cell,
            'o': output
        };
    },

    initLSTM: function(input_size, hidden_sizes, output_size) {
        // hidden size should be a list

        var model = {};
        for (var d = 0; d < hidden_sizes.length; d++) { // loop over depths
            var prev_size = d === 0 ? input_size : hidden_sizes[d - 1];
            var hidden_size = hidden_sizes[d];

            // gates parameters
            model['Wix' + d] = new this.RandMat(hidden_size, prev_size, 0, 0.08);
            model['Wih' + d] = new this.RandMat(hidden_size, hidden_size, 0, 0.08);
            model['bi' + d] = new Mat(hidden_size, 1);
            model['Wfx' + d] = new this.RandMat(hidden_size, prev_size, 0, 0.08);
            model['Wfh' + d] = new this.RandMat(hidden_size, hidden_size, 0, 0.08);
            model['bf' + d] = new Mat(hidden_size, 1);
            model['Wox' + d] = new this.RandMat(hidden_size, prev_size, 0, 0.08);
            model['Woh' + d] = new this.RandMat(hidden_size, hidden_size, 0, 0.08);
            model['bo' + d] = new Mat(hidden_size, 1);
            // cell write params
            model['Wcx' + d] = new this.RandMat(hidden_size, prev_size, 0, 0.08);
            model['Wch' + d] = new this.RandMat(hidden_size, hidden_size, 0, 0.08);
            model['bc' + d] = new Mat(hidden_size, 1);
        }
        // decoder params
        model['Whd'] = new this.RandMat(output_size, hidden_size, 0, 0.08);
        model['bd'] = new Mat(output_size, 1);
        return model;
    },


    // more utils
    updateMat: function(m, alpha) {
        // updates in place
        for (var i = 0, n = m.n * m.d; i < n; i++) {
            if (m.dw[i] !== 0) {
                m.w[i] += -alpha * m.dw[i];
                m.dw[i] = 0;
            }
        }
    },

    updateNet: function(net, alpha) {
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                this.updateMat(net[p], alpha);
            }
        }
    },

    copyMat: function(b) {
        var a = new Mat(b.n, b.d);
        a.setFrom(b.w);
        return a;
    },

    copyNet: function(net) {
        // nets are (k,v) pairs with k = string key, v = Mat()
        var new_net = {};
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                new_net[p] = this.copyMat(net[p]);
            }
        }
        return new_net;
    },

    netToJSON: function(net) {
        var j = {};
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                j[p] = net[p].toJSON();
            }
        }
        return j;
    },

    netFromJSON: function(j) {
        var net = {};
        for (var p in j) {
            if (j.hasOwnProperty(p)) {
                net[p] = new Mat(1, 1); // not proud of this
                net[p].fromJSON(j[p]);
            }
        }
        return net;
    },

    netZeroGrads: function(net) {
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                var mat = net[p];
                gradFillConst(mat, 0);
            }
        }
    },

    netFlattenGrads: function(net) {
        var n = 0;
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                var mat = net[p];
                n += mat.dw.length;
            }
        }
        var g = new Mat(n, 1);
        var ix = 0;
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                var mat = net[p];
                for (var i = 0, m = mat.dw.length; i < m; i++) {
                    g.w[ix] = mat.dw[i];
                    ix++;
                }
            }
        }
        return g;
    },

    // optimization
    Solver: Solver,
    Graph: Graph
};



// (function(global) {
//     // various utils
//     global.assert = assert;
//     global.zeros = zeros;
//     global.maxi = maxi;
//     global.samplei = samplei;
//     global.randi = randi;
//     global.randn = randn;
//     global.softmax = softmax;
//     // classes
//     global.Mat = Mat;
//     global.RandMat = RandMat;
//     global.forwardLSTM = forwardLSTM;
//     global.initLSTM = initLSTM;
//     // more utils
//     global.updateMat = updateMat;
//     global.updateNet = updateNet;
//     global.copyMat = copyMat;
//     global.copyNet = copyNet;
//     global.netToJSON = netToJSON;
//     global.netFromJSON = netFromJSON;
//     global.netZeroGrads = netZeroGrads;
//     global.netFlattenGrads = netFlattenGrads;
//     // optimization
//     global.Solver = Solver;
//     global.Graph = Graph;
// })(R);

export default Recurrent;
