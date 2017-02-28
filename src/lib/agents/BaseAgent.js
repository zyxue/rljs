import {randi} from '../utils.js';


const BaseAgent = function(env) {
    this.env = env;
};


BaseAgent.prototype = {
    reset() {
        this.resetValueFunction();

        // for keeping learning progress
        this.numEpisodesExperienced = 0;
        this.numStepsPerEpisode = []; // record how number decreases;
        this.numTotalSteps = 0; // record how number decreases;

        // reset episode level variables
        this.resetEpisode();
    },

    resetEpisode: function() {
    },

    resetValueFunction: function() {
    },

    resetTrace: function() {
    },

    // Main method for RL learning
    act: function() {
    },

    chooseAction: function(state) {
        
    },

    updateTrace: function(z, etraceType) {
    },

    initState: function(env) {
        // the initState method of agent is an abstraction over env.initState
        return env.initState();
    },

    chooseEpsilonGreedyAction: function(s0, epsilon) {
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

    takeAction: function() {
        let {s0, a0} = this;
        let [reward, s1] = this.env.gotoNextState(s0, a0);
        this.reward = reward;
        this.s1 = s1;
        this.a1 = this.chooseAction(this.s1, this.epsilon);
    },

    afterUpdate: function () {
        if (this.env.isTerminal(this.s0)) {
            this.numEpisodesExperienced += 1;
            this.numStepsPerEpisode.push(this.numStepsCurrentEpisode);
            this.resetEpisode();
        } else {
            this.s0 = this.s1;
            this.a0 = this.a1;
            this.numStepsCurrentEpisode += 1;
            this.numTotalSteps += 1;
        }
    },

    learnFromOneEpisode: function() {
        this.resetEpisode();
        while (! this.env.isTerminal(this.s0)) {
            this.act();

            if (this.numStepsCurrentEpisode > 2500) {
                console.error('taking too long to end one episode: > ' +
                              this.numStepsCurrentEpisode + ' steps.');
                break;
            }
        }

        // equivalent to exit at terminal state
        this.act();
    },

    learnFromMultipleEpisodes: function(num) {
        if (num === undefined) num = this.batchSize;
        for (let i = 0; i < num; i++) {
            this.learnFromOneEpisode();
        }
    }
};


export default BaseAgent;
