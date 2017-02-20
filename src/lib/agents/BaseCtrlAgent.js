import {randi} from '../utils';


let BaseCtrlAgent = function(env, {alpha=0.01,
                                   gamma=0.95,
                                   epsilon=0.1,

                                   batchSize=200,
                                   actingRate=100
                                  }={}) {
    // must store pointer to environment
    this.env = env;

    // learning rate
    this.alpha = alpha;
    // return discount factor
    this.gamma = gamma;
    // for epsilon-greedy policy
    this.epsilon = epsilon;


    // for learning from multiple episodes in batch
    this.batchSize = batchSize;
    // only useful when visualizing the agent taking actions continously
    this.actingRate = actingRate;
    this.reset();
};


BaseCtrlAgent.prototype = {
    reset: function() {
        this.resetValueFunction();

        // for keeping learning progress
        this.numEpisodesExperienced = 0;
        this.numStepsPerEpisode = []; // record how number decreases;

        this.resetEpisode();
    },

    resetEpisode: function() {
        // reset epsiode level variables
        this.numStepsCurrentEpisode = 0;
        this.s0 = this.initState(this.env);
        this.a0 = this.chooseAction(this.s0, this.epsilon);
        this.reward = 0;
        this.s1 = null;
        this.a1 = null;
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
            state.Z = {};        // current etrace
            state.epiHistZ = {}; // episodic historical etrace
            state.allowedActions.forEach(function(action) {
                state.Z[action] = 0;
                state.epiHistZ[action] = [];
            });
        });
    },

    initState: function(env) {
        // the initState method of agent is an abstraction over env.initState
        return env.initState();
    },

    chooseAction: function(s0, epsilon) {
        // implemented the ∈-greedy algorithms
        return Math.random() < epsilon ? this.chooseRandomAction(s0) : this.chooseGreedyAction(s0);
    },

    chooseRandomAction: function(s0) {
        let randomInt = randi(0, s0.allowedActions.length);
        let a0 = s0.allowedActions[randomInt];
        return a0;
    },

    chooseGreedyAction: function(s0) {
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

    // Main method for RL learning
    act: function() {
        // to be overwritten

        // this.takeAction();

        // then run the key RL learning algorithm to update

        // this.afterUpdate();
    },

    takeAction: function() {
        let {s0, a0} = this;
        let [reward, s1] = this.env.gotoNextState(s0, a0);
        this.reward = reward;
        this.s1 = s1;
        this.a1 = this.chooseAction(this.s1, this.epsilon);
        this.numStepsCurrentEpisode += 1;
    },

    afterUpdate: function () {
        if (this.env.isTerminal(this.s0)) {
            this.numEpisodesExperienced += 1;
            this.numStepsPerEpisode.push(this.numStepsCurrentEpisode);
            this.resetEpisode();
        } else {
            this.s0 = this.s1;
            this.a0 = this.a1;
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
};

export default BaseCtrlAgent;
