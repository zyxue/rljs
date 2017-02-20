// Write the methods of the TDAgent class as functional (pure) as possible to ease
// testing, but some functions are cumbersome to purify, e.g. reset().

import {randi} from '../utils';


let DynaQAgent = function(env, {alpha=0.01, gamma=0.95, epsilon=0.1,
                                numSessions=10,
                             batchSize=200, actingRate=100}={}) {
    // store pointer to environment
    this.env = env;

    // learning rate
    this.alpha = alpha;
    // return discount factor
    this.gamma = gamma;
    // for epsilon-greedy policy
    this.epsilon = epsilon;

    // this is the number of repeats after updating the model
    this.numSessions = numSessions;

    // // modeling while learning, that's dyna-Q
    // this.model = {
    //     model: {},              // for storing (S, A) => (R, S') mapping
    //     experience: {
    //         // for storing stateid => {action: [reward, S']} mapping
    //     }
    // };


    // modeling while learning, that's dyna-Q
    this.model = {
        states: []
    };            // should have similar data structure as
                                // env.states except it has predefined reward
                                // and next state

    // for learning from multiple episodes in batch
    this.batchSize = batchSize;
    // only useful when visualizing the agent taking actions continously
    this.actingRate = actingRate;
    this.reset();
};


DynaQAgent.prototype = {
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

    act: function() {
        // Main method for learning
        this.takeAction();
        this.dynaQUpdate();
        this.afterUpdate();
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

    dynaQUpdate: function() {
        // implement Dyna-Q algorithm in Figure 8.4
        let {s0, a0, reward, s1, a1} = this;

        let aStar = this.chooseGreedyAction(s1);
        let delta = reward + this.gamma * s1.Q[aStar] - s0.Q[a0];
        s0.Q[a0] += this.alpha * delta;

        // update the model
        if (this.model.states[s0.id] === undefined) {
            this.model.states[s0.id] = {
                id: s0.id,
                nextState: {}
            };
            this.model.states[s0.id].nextState[a0] = [reward, s1.id];
        } else {
            this.model.states[s0.id].nextState[a0] = [reward, s1.id];
        }

        // modeling, n times
        let counter = 0;
        while (counter < this.numSessions) {
            // r: random, m: model, e: env

            // cannot use this.model.states.length as many elements are just
            // undefined in this particular javascript array, But Object.keys()
            // only return the non-undefined keys (in string though);
            let seenStateIds = this.model.states.filter((s) => s !== undefined).map((s) => s.id);
            let rS0Id = seenStateIds[randi(0, seenStateIds.length)];
            let mS0 = this.model.states[rS0Id];
            let eS0 = this.env.states[rS0Id];

            let seenActions = Object.keys(mS0.nextState);
            let rA0 = seenActions[randi(0, seenActions.length)];
            // console.log(mS0, seenActions, rA0);
            let [mReward, rS1Id] = this.model.states[rS0Id].nextState[rA0];
            let mS1 = this.model.states[rS1Id];
            let eS1 = this.env.states[rS1Id];

            let eAStar = this.chooseGreedyAction(eS1);
            let eDelta = mReward + this.gamma * eS1.Q[eAStar] - eS0.Q[rA0];
            eS0.Q[rA0] += this.alpha * eDelta;

            counter += 1;
        }
    },



    // sarsaLambdaUpdate: function() {
    //     // implement the "repeat (for each step of episode)" part of Figure
    //     // 7.11: Tabular Sarsa(λ)
    //     let {s0, a0, reward, s1, a1} = this;

    //     let delta = reward + this.gamma * s1.Q[a1] - s0.Q[a0];
    //     s0.Z[a0] += 1;

    //     let that = this;
    //     this.env.states.forEach((state) => {
    //         state.allowedActions.forEach((action) => {
    //             state.Q[action] += that.alpha * delta * state.Z[action];
    //             state.Z[action] *= that.gamma * that.lambda;
    //             state.epiHistZ[action].push(state.Z[action])
    //         });
    //     });
    // },

    // watkinsQLambdaUpdate: function() {
    //     // implement the Watkins' Q(λ) in Figure 7.14
    //     let {s0, a0, reward, s1, a1} = this;

    //     let aStar = this.chooseGreedyAction(s1);
    //     let delta = reward + this.gamma * s1.Q[aStar] - s0.Q[a0];
    //     s0.Z[a0] += 1;

    //     let that = this;
    //     this.env.states.forEach((state) => {
    //         state.allowedActions.forEach((action) => {
    //             state.Q[action] += that.alpha * delta * state.Z[action];
    //             if (a1 === aStar) {
    //                 state.Z[action] *= that.gamma * that.lambda;
    //             } else {
    //                 state.Z[action] = 0;
    //             }
    //             state.epiHistZ[action].push(state.Z[action])
    //         });
    //     });
    // },

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


    // updateModel: function(s0, a0, r0, s1, a1) {
    // },

    // plan: function() {
    // },

    // learnFromTuple: function(s0, a0, r0, s1, a1, lambda) {
    // },

    // updatePriority: function(s,a,u) {
    // },

    // updatePolicy: function(s) {
    // }
};

export default DynaQAgent;
