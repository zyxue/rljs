import {randi} from '../utils.js';

// Summary of DP methods:

// policy iteration includes policy evaluation and policy improvement

// value iteration includes value converge (very similar to policy evaluation
// except for a max operation) and policy generation, which is relatively
// trivial

const DPAgent = function(env, {gamma=0.95, batchSize=200}={}) {
    // store pointer to environment
    this.env = env;

    // return discount factor
    this.gamma = gamma;

    // for learning from multiple episodes in batch
    this.batchSize = batchSize;
    this.reset();
};


DPAgent.prototype = {
    reset: function() {
        this.resetValueFunction();
        // aka number of policy evaluations
        this.numPolicyEvaluations = 0;
    },

    resetValueFunction: function() {
        this.env.states.forEach(function(state) {
            state.V = 0;
            // could store multiple actions if they are of the same value
            state.PI = state.allowedActions;
        });
    },

    evaluatePolicy: function() {
        const theta = 1e-3;     // a cutoff
        let currentDelta = 0;
        while (true) {
            this.env.states.forEach((state) => {
                // could be a cliff or something
                if (state.PI.length === 0) return;
                let oldV = state.V;
                // console.debug('action, ', state.id, state.PI);
                // probability of taking each action
                let newV = 0;
                let prob = 1 / state.PI.length;
                state.PI.forEach((action) => {
                    let [reward, s1] = this.env.gotoNextState(state, action);
                    newV += prob * (reward + this.gamma * s1.V);
                });
                console.log(newV);
                let currentDelta = Math.max(currentDelta, Math.abs(newV - oldV));
                state.V = newV;
            });

            if (currentDelta < theta) {break;}
        }
        this.numPolicyEvaluations += 1;
    },

    updatePolicy: function() {
        const theta = 1e-3;
        let isStable = true;
        this.env.states.forEach((state) => {
            let maxVal = null;
            let actionVals = state.allowedActions.map(function(action) {
                let s1, reward = this.env.gotoNextState(state, action);
                let val = reward + this.gamma * s1.V;
                if (maxVal === null || maxVal < val) maxVal = val;
                return [action, val];
            });

            // convert to string to ease float comparison
            // http://stackoverflow.com/questions/3343623/javascript-comparing-two-float-values
            let maxValStr = maxVal.toFixed(7);

            let nMax = 0;
            let actionsToMaxVals = []; // actions that leads to max value
            actionVals.forEach(([action, val]) => {
                if (val.toFixed(7) == maxValStr) {
                    nMax += 1;
                    actionsToMaxVals.push(action);
                }
            });

            state.PI = actionsToMaxVals;
        });
    },

    act: function() {
        this.evaluatePolicy();
    }

    // part of value iteration

    // this.env.states.forEach((state) => {
    //     let tmpV = state.V;
    //     // let maxV = Math.max(...Object.values(state.Q));
    //     let vs = state.allowedActions.map((action) => {
    //         let s1, reward = this.env.gotoNextState(state, action);
    //         return reward + this.gamma * s1.V;
    //     });
    //     let maxV = Math.max(...vs);
    // });

    // learnFromOneEpisode: function() {
    //     this.resetEpisode();
    //     while (! this.env.isTerminal(this.s0)) {
    //         this.act();

    //         if (this.numStepsCurrentEpisode > 2500) {
    //             console.error('taking too long to end one episode: > ' +
    //                           this.numStepsCurrentEpisode + ' steps.');
    //             break;
    //         }
    //     }

    //     // equivalent to exit at terminal state
    //     this.act();
    // },

    // learnFromBatchEpisodes: function() {
    //     for (let i = 0; i < this.batchSize; i++) {
    //         this.learnFromOneEpisode();
    //     }
    // },
};

export default DPAgent;
