import {zeros, randi} from '../utils';


let TDAgent = function(env, {alpha=0.01, gamma=0.95, epsilon=0.1, lambda=0.7,
                             etraceType='accumulatingTrace',
                             learningAlgo='sarsaLambda',
                             batchSize=200}={}) {
    // store pointer to environment
    this.env = env;

    // learning rate
    this.alpha = alpha;
    // return discount factor
    this.gamma = gamma;
    // for epsilon-greedy policy
    this.epsilon = epsilon;
    // Trace-decay parameter
    this.lambda = lambda;

    this.learningAlgo = learningAlgo;

    // for learning from multiple episodes in batch
    this.batchSize = batchSize;
    this.reset();
};


TDAgent.prototype = {
    reset: function(){
        this.resetValueFunction();

        // for keeping learning progress
        this.numEpisodesExperienced = 0;
        this.numStepsPerEpisode = []; // record how number decreases;

        this.resetEpisode();
    },

    resetEpisode: function() {
        // reset epsiode level variables
        this.numStepsCurrentEpisode = 0;
        this.s0 = this.env.initState();
        this.a0 = this.chooseAction(this.s0);
        this.resetTrace();
    },

    resetValueFunction: function() {
        this.env.states.forEach(function(state) {
            state.Q = {};        // state-action value
            state.allowedActions.forEach(function(action) {
                state.Q[action] = 0;
            });
        });
    },

    resetTrace: function() {
        // reset eligibility trace
        this.env.states.forEach(function(state) {
            state.Z = {},        // current etrace
            state.epiHistZ = {}; // episodic historical etrace
            state.allowedActions.forEach(function(action) {
                state.Z[action] = 0;
                state.epiHistZ[action] = [];
            });
        });
    },

    takeRandomAction: function(s0) {
        let randomInt = randi(0, s0.allowedActions.length);
        let a0 = s0.allowedActions[randomInt];
        return a0;
    },

    takeGreedyAction: function(s0) {
        let actions = s0.allowedActions;
        let a0 = actions[randi(0, actions.length)];
        let qVal = s0.Q[a0];
        for (let i=0; i < actions.length; i++) {
            let _qVal = s0.Q[actions[i]];
            if (_qVal > qVal) {
                qVal = _qVal;
                a0 = actions[i];
            }
        }
        return a0;
    },

    chooseAction: function(s0) {
        return Math.random() < this.epsilon ? this.takeRandomAction(s0) : this.takeGreedyAction(s0);
    },

    _getIdx: function(s, a) {
        return s * this.maxNumActions + a;
    },

    getQ: function(s, a) {
        let idx = this._getIdx(s, a);
        return this.Q[idx];
    },

    sarsaAct: function() {
        // implement the "repeat (for each step of episode)" part of Figure
        // 7.11: Tabular Sarsa(λ)

        let {s0, a0} = this;
        let [reward, s1] = this.env.gotoNextState(s0, a0);
        let a1 = this.chooseAction(s1);

        this.numStepsCurrentEpisode += 1;
        // console.debug(s0, a0, reward, s1, a1);

        let delta = reward + this.gamma * s1.Q[a1] - s0.Q[a0];
        s0.Z[a0] = s0.Z[a0] + 1;

        let that = this;
        this.env.states.forEach((state) => {
            state.allowedActions.forEach((action) => {
                state.Q[action] = state.Q[action] + that.alpha * delta * state.Z[action];
                state.Z[action] = that.gamma * that.lambda * state.Z[action];
            });
        });

        if (this.env.isTerminal(s0)) {
            this.numEpisodesExperienced += 1;
            this.numStepsPerEpisode.push(this.numStepsCurrentEpisode);
            this.resetEpisode();
        } else {
            this.s0 = s1;
            this.a0 = a1;
        }
    },

    qLambdaAct: function() {
        // implement the Watkins' Q(λ) in Figure 7.14

        let {s0, a0} = this;
        let [reward, s1] = this.env.gotoNextState(s0, a0);
        let a1 = this.chooseAction(s1);

        this.numStepsCurrentEpisode += 1;

        let aStar = this.takeGreedyAction(s1);
        let delta = reward + this.gamma * s1.Q[aStar] - s0.Q[a0];
        s0.Z[a0] = s0.Z[a0] + 1;

        let that = this;
        this.env.states.forEach((state) => {
            state.allowedActions.forEach((action) => {
                state.Q[action] = state.Q[action] + that.alpha * delta * state.Z[action];
                if (a1 == aStar) {
                    state.Z[action] = that.gamma * that.lambda * state.Z[action];
                } else {
                    state.Z[action] = 0;
                }
            });
        });

        if (this.env.isTerminal(this.s0)) {
            this.numEpisodesExperienced += 1;
            this.numStepsPerEpisode.push(this.numStepsCurrentEpisode);
            this.resetEpisode();
        } else {
            this.s0 = s1;
            this.a0 = a1;
        }
    },

    act: function() {
        if (this.learningAlgo === 'sarsaLambda') {
            this.sarsaAct();
        } else if (this.learningAlgo === 'qLambda') {
            this.qLambdaAct();
        } else {
            console.error('unimplemented learning algorithm: ' + this.learningAlgo);
        }
    },

    learnFromOneEpisode: function() {
        this.resetEpisode();
        while (! this.env.isTerminal(this.s0)) {
            this.act();

            if (this.numStepsCurrentEpisode > 5000) {
                console.error('taking too long to end one episode: > ' +
                              this.numStepsCurrentEpisode + ' steps.');
                break;
            }
        }

        // equivalent to exit at terminal state
        this.act();
    },

    learnFromBatchEpisodes: function() {
        for (let i = 0; i < this.batchSize; i++) {
            this.learnFromOneEpisode();
        }
    },

    learn: function(r1) {
        // learn till it converges
    },

    updateModel: function(s0, a0, r0, s1, a1) {
    },

    plan: function() {
    },

    learnFromTuple: function(s0, a0, r0, s1, a1, lambda) {
    },

    updatePriority: function(s,a,u) {
    },

    updatePolicy: function(s) {
    }
};

export default TDAgent;
