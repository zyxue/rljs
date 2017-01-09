import {zeros, randi} from '../utils';


let TDAgent = function(env, {alpha=0.01, gamma=0.95, epsilon=0.1, lambda=0.7,
                             etraceType='accumulatingTrace',
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

    this.learningAlgo = 'sarsaLambda';

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
        let randomInt = randi(0, s0.allowedActions.legnth);
        return s0.allowedActions[randomInt];
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

        let s0 = this.s0;
        let a0 = this.a0;

        let res = this.env.gotoNextState(s0, a0);
        let reward = res.reward;
        let s1 = res.nextState;
        let a1 = this.chooseAction(s1);

        this.numStepsCurrentEpisode += 1;
        // console.debug(s0, a0, reward, s1, a1);

        let delta = reward + this.gamma * this.getQ(s1, a1) - this.getQ(s0, a0);
        let idx0 = this._getIdx(s0, a0);
        this.Z[idx0] = this.Z[idx0] + 1;

        for (let si=0; si < this.numStates; si++) {
            for (let aj=0; aj < this.maxNumActions; aj++) {
                let idx = this._getIdx(si, aj);
                this.Q[idx] = this.Q[idx] + this.alpha * delta * this.Z[idx];
                this.Z[idx] = this.gamma * this.lambda * this.Z[idx];
            }
        }

        if (this.env.isTerminal(this.s0)) {
            this.numEpisodesExperienced += 1;
            this.numStepsPerEpisode.push(this.numStepsCurrentEpisode);
            this.resetEpisode();
        } else {
            this.s0 = s1;
            this.a0 = a1;
        }
    },

    qLearningAct: function() {
        // implement the "repeat (for each step of episode)" part of Figure
        // 7.11: Tabular Sarsa(λ)

        let s0 = this.s0;
        let a0 = this.a0;

        let res = this.env.gotoNextState(s0, a0);
        let reward = res.reward;
        let s1 = res.nextState;
        let a1 = this.chooseAction(s1);

        this.numStepsCurrentEpisode += 1;
        // console.debug(s0, a0, reward, s1, a1);

        let a_star = this.takeGreedyAction(s1)
        let delta = reward + this.gamma * this.getQ(s1, a_star) - this.getQ(s0, a0);

        let idx0 = this._getIdx(s0, a0);
        this.Z[idx0] = this.Z[idx0] + 1;

        for (let si=0; si < this.numStates; si++) {
            for (let aj=0; aj < this.maxNumActions; aj++) {
                let idx = this._getIdx(si, aj);
                this.Q[idx] = this.Q[idx] + this.alpha * delta * this.Z[idx];
                if (a1 === a_star) {
                    this.Z[idx] = this.gamma * this.lambda * this.Z[idx];
                } else {
                    this.Z[idx] = 0;
                }
            }
        }

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
        // this.sarsaAct();
        if (this.learningAlgo === 'sarsa') {
            this.sarsaAct()
        } else if (this.learningAlgo === 'qlearning') {
            this.qLearningAct();
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
