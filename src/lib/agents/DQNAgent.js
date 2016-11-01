import R from '../r.js';
import getopt from '../utils';


var DQNAgent = function(env, opt) {
    this.gamma = getopt(opt, 'gamma', 0.75); // future reward discount factor
    this.epsilon = getopt(opt, 'epsilon', 0.1); // for epsilon-greedy policy
    this.alpha = getopt(opt, 'alpha', 0.01); // value function learning rate

    this.experience_add_every = getopt(opt, 'experience_add_every', 25); // number of time steps before we add another experience to replay memory
    this.experience_size = getopt(opt, 'experience_size', 5000); // size of experience replay
    this.learning_steps_per_iteration = getopt(opt, 'learning_steps_per_iteration', 10);
    this.tderror_clamp = getopt(opt, 'tderror_clamp', 1.0);

    this.num_hidden_units = getopt(opt, 'num_hidden_units', 100);

    this.env = env;
    this.reset();
};

DQNAgent.prototype = {
    reset: function() {
        this.nh = this.num_hidden_units; // number of hidden units
        this.ns = this.env.getNumStates();
        this.na = this.env.getMaxNumActions();

        // nets are hardcoded for now as key (str) -> Mat
        // not proud of this. better solution is to have a whole Net object
        // on top of Mats, but for now sticking with this
        this.net = {};
        this.net.W1 = new R.RandMat(this.nh, this.ns, 0, 0.01);
        this.net.b1 = new R.Mat(this.nh, 1, 0, 0.01);
        this.net.W2 = new R.RandMat(this.na, this.nh, 0, 0.01);
        this.net.b2 = new R.Mat(this.na, 1, 0, 0.01);

        this.exp = []; // experience
        this.expi = 0; // where to insert

        this.t = 0;

        this.r0 = null;
        this.s0 = null;
        this.s1 = null;
        this.a0 = null;
        this.a1 = null;

        this.tderror = 0; // for visualization only...
    },
    toJSON: function() {
        // save function
        var j = {};
        j.nh = this.nh;
        j.ns = this.ns;
        j.na = this.na;
        j.net = R.netToJSON(this.net);
        return j;
    },
    fromJSON: function(j) {
        // load function
        this.nh = j.nh;
        this.ns = j.ns;
        this.na = j.na;
        this.net = R.netFromJSON(j.net);
    },
    forwardQ: function(net, s, needs_backprop) {
        var G = new R.Graph(needs_backprop);
        var a1mat = G.add(G.mul(net.W1, s), net.b1);
        var h1mat = G.tanh(a1mat);
        var a2mat = G.add(G.mul(net.W2, h1mat), net.b2);
        this.lastG = G; // back this up. Kind of hacky isn't it
        return a2mat;
    },
    act: function(slist) {
        // convert to a Mat column vector
        var s = new R.Mat(this.ns, 1);
        s.setFrom(slist);

        // epsilon greedy policy
        if (Math.random() < this.epsilon) {
            var a = R.randi(0, this.na);
        } else {
            // greedy wrt Q function
            var amat = this.forwardQ(this.net, s, false);
            var a = R.maxi(amat.w); // returns index of argmax action
        }

        // shift state memory
        this.s0 = this.s1;
        this.a0 = this.a1;
        this.s1 = s;
        this.a1 = a;

        return a;
    },
    learn: function(r1) {
        // perform an update on Q function
        if (!(this.r0 == null) && this.alpha > 0) {

            // learn from this tuple to get a sense of how "surprising" it is to the agent
            var tderror = this.learnFromTuple(this.s0, this.a0, this.r0, this.s1, this.a1);
            this.tderror = tderror; // a measure of surprise

            // decide if we should keep this experience in the replay
            if (this.t % this.experience_add_every === 0) {
                this.exp[this.expi] = [this.s0, this.a0, this.r0, this.s1, this.a1];
                this.expi += 1;
                if (this.expi > this.experience_size) {
                    this.expi = 0;
                } // roll over when we run out
            }
            this.t += 1;

            // sample some additional experience from replay memory and learn from it
            for (var k = 0; k < this.learning_steps_per_iteration; k++) {
                var ri = R.randi(0, this.exp.length); // todo: priority sweeps?
                var e = this.exp[ri];
                this.learnFromTuple(e[0], e[1], e[2], e[3], e[4])
            }
        }
        this.r0 = r1; // store for next update
    },
    learnFromTuple: function(s0, a0, r0, s1, a1) {
        // want: Q(s,a) = r + gamma * max_a' Q(s',a')

        // compute the target Q value
        var tmat = this.forwardQ(this.net, s1, false);
        var qmax = r0 + this.gamma * tmat.w[R.maxi(tmat.w)];

        // now predict
        var pred = this.forwardQ(this.net, s0, true);

        var tderror = pred.w[a0] - qmax;
        var clamp = this.tderror_clamp;
        if (Math.abs(tderror) > clamp) { // huber loss to robustify
            if (tderror > clamp) tderror = clamp;
            if (tderror < -clamp) tderror = -clamp;
        }
        pred.dw[a0] = tderror;
        this.lastG.backward(); // compute gradients on net params

        // update net
        R.updateNet(this.net, this.alpha);
        return tderror;
    }
};

export default DQNAgent;
