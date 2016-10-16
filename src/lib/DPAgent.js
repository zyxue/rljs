import R from './r';


let getopt = function(opt, field_name, default_value) {
    if (typeof opt === 'undefined') {
        return default_value;
    }
    return (typeof opt[field_name] !== 'undefined') ? opt[field_name] : default_value;
};


let sampleWeighted = function(p) {
    console.log(p);
    var r = Math.random();
    var c = 0.0; // cumulative prob
    for (var i = 0, n = p.length; i < n; i++) {
        c += p[i];
        if (c >= r) {
            return i;
        }
    }
    // R.assert(false) may happen if sum(p) < 1;
    R.assert(false, 'wtf');
};


// DPAgent performs Value Iteration
// - can also be used for Policy Iteration if you really wanted to
// - requires model of the environment :(
// - does not learn from experience :(
// - assumes finite MDP :(
let DPAgent = function(env, opt) {
    this.V = null; // state value function
    this.P = null; // policy distribution \pi(s,a)
    this.env = env; // store pointer to environment
    this.gamma = getopt(opt, 'gamma', 0.75); // future reward discount factor
    this.reset();
};

DPAgent.prototype = {
    reset: function() {
        // reset the agent's policy and value function
        this.numStates = this.env.getNumStates();
        this.numActions = this.env.getMaxNumActions();
        this.V = R.zeros(this.numStates);
        this.P = R.zeros(this.numStates * this.numActions);
        // initialize uniform random policy
        for (let s = 0; s < this.numStates; s++) {
            let poss = this.env.allowedActions(s);
            for (let i = 0, n = poss.length; i < n; i++) {
                // console.log(1.0 / poss.length);
                this.P[poss[i] * this.numStates + s] = 1.0 / poss.length;
            }
        }
    },

    evaluatePolicy: function() {
        // perform a synchronous update of the value function
        let Vnew = R.zeros(this.numStates);
        for (let s = 0; s < this.numStates; s++) {
            // integrate over actions in a stochastic policy note that we
            // assume that policy probability mass over allowed actions sums
            // to one
            let v = 0.0;
            let poss = this.env.allowedActions(s);
            for (let i = 0, n = poss.length; i < n; i++) {
                let a = poss[i];
                let prob = this.P[a * this.numStates + s]; // probability of taking action under policy
                if (prob === 0) {
                    continue;
                } // no contribution, skip for speed
                let ns = this.env.nextStateDistribution(s, a);
                let rs = this.env.reward(s, a, ns); // reward for s->a->ns transition
                v += prob * (rs + this.gamma * this.V[ns]);
            }
            Vnew[s] = v;
        }
        this.V = Vnew; // swap
    },

    updatePolicy: function() {
        // update policy to be greedy w.r.t. learned Value function
        for (let s = 0; s < this.numStates; s++) {
            let poss = this.env.allowedActions(s);
            // compute value of taking each allowed action
            let vmax, nmax;
            let vs = [];
            for (let i = 0, n = poss.length; i < n; i++) {
                let a = poss[i];
                let ns = this.env.nextStateDistribution(s, a);
                let rs = this.env.reward(s, a, ns);
                let v = rs + this.gamma * this.V[ns];
                vs.push(v);
                if (i === 0 || v > vmax) {
                    vmax = v;
                    nmax = 1;
                } else if (v === vmax) {
                    nmax += 1;
                }
            }
            // update policy smoothly across all argmaxy actions
            for (let i = 0, n = poss.length; i < n; i++) {
                let a = poss[i];
                this.P[a * this.numStates + s] = (vs[i] === vmax) ? 1.0 / nmax : 0.0;
            }
        }
    },

    learn: function() {
        // perform a single round of value iteration
        this.evaluatePolicy(); // writes this.V
        this.updatePolicy(); // writes this.P
    },

    act: function(s) {
        // behave according to the learned policy possible actions
        let poss = this.env.allowedActions(s);
        let ps = [];
        for (let i = 0, n = poss.length; i < n; i++) {
            let a = poss[i];
            let prob = this.P[a * this.numStates + s];
            ps.push(prob);
        }
        // randomly break tie given one of the multiple actions in this
        // state give the same value
        let maxi = sampleWeighted(ps);
        return poss[maxi];
    }
};

export default DPAgent;
