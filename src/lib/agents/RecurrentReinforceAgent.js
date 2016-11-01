// buggy implementation as well, doesn't work
var RecurrentReinforceAgent = function(env, opt) {
    this.gamma = getopt(opt, 'gamma', 0.5); // future reward discount factor
    this.epsilon = getopt(opt, 'epsilon', 0.1); // for epsilon-greedy policy
    this.alpha = getopt(opt, 'alpha', 0.001); // actor net learning rate
    this.beta = getopt(opt, 'beta', 0.01); // baseline net learning rate
    this.env = env;
    this.reset();
};

RecurrentReinforceAgent.prototype = {
    reset: function() {
        this.ns = this.env.getNumStates();
        this.na = this.env.getMaxNumActions();
        this.nh = 40; // number of hidden units
        this.nhb = 40; // and also in the baseline lstm

        this.actorLSTM = R.initLSTM(this.ns, [this.nh], this.na);
        this.actorG = new R.Graph();
        this.actorPrev = null;
        this.actorOutputs = [];
        this.rewardHistory = [];
        this.actorActions = [];

        this.baselineLSTM = R.initLSTM(this.ns, [this.nhb], 1);
        this.baselineG = new R.Graph();
        this.baselinePrev = null;
        this.baselineOutputs = [];

        this.t = 0;

        this.r0 = null;
        this.s0 = null;
        this.s1 = null;
        this.a0 = null;
        this.a1 = null;
    },
    act: function(slist) {
        // convert to a Mat column vector
        var s = new R.Mat(this.ns, 1);
        s.setFrom(slist);

        // forward the LSTM to get action distribution
        var actorNext = R.forwardLSTM(this.actorG, this.actorLSTM, [this.nh], s, this.actorPrev);
        this.actorPrev = actorNext;
        var amat = actorNext.o;
        this.actorOutputs.push(amat);

        // forward the baseline LSTM
        var baselineNext = R.forwardLSTM(this.baselineG, this.baselineLSTM, [this.nhb], s, this.baselinePrev);
        this.baselinePrev = baselineNext;
        this.baselineOutputs.push(baselineNext.o);

        // sample action from actor policy
        var gaussVar = 0.05;
        var a = R.copyMat(amat);
        for (var i = 0, n = a.w.length; i < n; i++) {
            a.w[0] += R.randn(0, gaussVar);
            a.w[1] += R.randn(0, gaussVar);
        }
        this.actorActions.push(a);

        // shift state memory
        this.s0 = this.s1;
        this.a0 = this.a1;
        this.s1 = s;
        this.a1 = a;
        return a;
    },
    learn: function(r1) {
        // perform an update on Q function
        this.rewardHistory.push(r1);
        var n = this.rewardHistory.length;
        var baselineMSE = 0.0;
        var nup = 100; // what chunk of experience to take
        var nuse = 80; // what chunk to also update
        if (n >= nup) {
            // lets learn and flush
            // first: compute the sample values at all points
            var vs = [];
            for (var t = 0; t < nuse; t++) {
                var mul = 1;
                var V = 0;
                for (var t2 = t; t2 < n; t2++) {
                    V += mul * this.rewardHistory[t2];
                    mul *= this.gamma;
                    if (mul < 1e-5) {
                        break;
                    } // efficiency savings
                }
                var b = this.baselineOutputs[t].w[0];
                // todo: take out the constants etc.
                for (var i = 0; i < this.na; i++) {
                    // [the action delta] * [the desirebility]
                    var update = -(V - b) * (this.actorActions[t].w[i] - this.actorOutputs[t].w[i]);
                    if (update > 0.1) {
                        update = 0.1;
                    }
                    if (update < -0.1) {
                        update = -0.1;
                    }
                    this.actorOutputs[t].dw[i] += update;
                }
                var update = -(V - b);
                if (update > 0.1) {
                    update = 0.1;
                }
                if (update < 0.1) {
                    update = -0.1;
                }
                this.baselineOutputs[t].dw[0] += update;
                baselineMSE += (V - b) * (V - b);
                vs.push(V);
            }
            baselineMSE /= nuse;
            this.actorG.backward(); // update params! woohoo!
            this.baselineG.backward();
            R.updateNet(this.actorLSTM, this.alpha); // update actor network
            R.updateNet(this.baselineLSTM, this.beta); // update baseline network

            // flush
            this.actorG = new R.Graph();
            this.actorPrev = null;
            this.actorOutputs = [];
            this.rewardHistory = [];
            this.actorActions = [];

            this.baselineG = new R.Graph();
            this.baselinePrev = null;
            this.baselineOutputs = [];

            this.tderror = baselineMSE;
        }
        this.t += 1;
        this.r0 = r1; // store for next update
    }
};


export default RecurrentReinforceAgent;
