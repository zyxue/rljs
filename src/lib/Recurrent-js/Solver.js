import {Mat} from './Mat';


var Solver = function() {
    this.decay_rate = 0.999;
    this.smooth_eps = 1e-8;
    this.step_cache = {};
};

Solver.prototype = {
    step: function(model, step_size, regc, clipval) {
        // perform parameter update
        var solver_stats = {};
        var num_clipped = 0;
        var num_tot = 0;
        for (var k in model) {
            if (model.hasOwnProperty(k)) {
                var m = model[k]; // mat ref
                if (!(k in this.step_cache)) {
                    this.step_cache[k] = new Mat(m.n, m.d);
                }
                var s = this.step_cache[k];
                for (var i = 0, n = m.w.length; i < n; i++) {

                    // rmsprop adaptive learning rate
                    var mdwi = m.dw[i];
                    s.w[i] = s.w[i] * this.decay_rate + (1.0 - this.decay_rate) * mdwi * mdwi;

                    // gradient clip
                    if (mdwi > clipval) {
                        mdwi = clipval;
                        num_clipped++;
                    }
                    if (mdwi < -clipval) {
                        mdwi = -clipval;
                        num_clipped++;
                    }
                    num_tot++;

                    // update (and regularize)
                    m.w[i] += -step_size * mdwi / Math.sqrt(s.w[i] + this.smooth_eps) - regc * m.w[i];
                    m.dw[i] = 0; // reset gradients for next iteration
                }
            }
        }
        solver_stats['ratio_clipped'] = num_clipped * 1.0 / num_tot;
        return solver_stats;
    }
};

export default Solver;
