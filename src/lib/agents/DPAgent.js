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
        this.numValueIterations = 0
        this.numPolicyIterations = 0;
    },

    resetValueFunction: function() {
        this.env.states.forEach(function(state) {
            state.V = 0;
            // could store multiple actions if they are of the same value
            state.Pi = state.allowedActions;
        });
    },

    evaluatePolicy: function() {
        const theta = 1e-3;     // a cutoff
        while (true) {
            let currentDelta = 0;
            this.env.states.forEach((state) => {
                // could be a cliff or something
                if (state.Pi.length === 0) return;
                let oldV = state.V;
                // console.debug('action, ', state.id, state.Pi);
                // probability of taking each action
                let newV = 0;
                let prob = 1 / state.Pi.length;
                state.Pi.forEach((action) => {
                    let [reward, s1] = this.env.gotoNextState(state, action);
                    newV += prob * (reward + this.gamma * s1.V);
                });
                currentDelta = Math.max(currentDelta, Math.abs(newV - oldV));
                state.V = newV;
            });
            // console.debug(currentDelta);
            if (currentDelta < theta) {break;}
        }
        this.numPolicyIterations += 1;
    },

    updatePolicy: function() {
        let isStable = true;
        this.env.states.forEach((state) => {
            if (state.allowedActions.length === 0) return;

            let oldPi = state.Pi;

            let maxVal = null;
            let actionVals = [];
            state.allowedActions.forEach((action) => {
                let [reward, s1] = this.env.gotoNextState(state, action);
                let _val = reward + this.gamma * s1.V;
                if (maxVal === null || maxVal < _val) maxVal = _val;
                actionVals.push([action, _val]);
            });

            // convert to string to ease float comparison
            // http://stackoverflow.com/questions/3343623/javascript-comparing-two-float-values
            let maxValStr = maxVal.toPrecision(5);

            let actionsToMaxVals = []; // actions that leads to max value
            actionVals.forEach(([action, val]) => {
                if (val.toPrecision(5) == maxValStr) {
                    actionsToMaxVals.push(action);
                }
            });

            let newPi = actionsToMaxVals;
            state.Pi = newPi;
            if (! this.areTheSamePolicies(oldPi, newPi)) isStable = false;
        });

        return isStable;
    },

    areTheSamePolicies: function(p1, p2) {
        // compare two policies and see if they are the same
        if (p1.length !== p2.length) return false;

        const sp1 = p1.sort();
        const sp2 = p2.sort();
        for (let i=0; i < sp1,length; i++) {
            if (sp1[i] !== sp2[i]) return false;
        }
        return true;
    },

    iteratePolicy: function() {
        this.evaluatePolicy();
        let isStable = this.updatePolicy();
        return isStable;
    },

    iterateValue: function() {
        const theta = 1e-6;     // a cutoff

        let currentDelta = 0;
        this.env.states.forEach((state) => {
            if (state.Pi.length === 0) return;

            let oldV = state.V;
            let maxV = null;
            state.allowedActions.forEach((action) => {
                let [reward, s1] = this.env.gotoNextState(state, action);
                let newV = reward + this.gamma * s1.V;
                if (maxV === null || maxV < newV) {
                    maxV = newV;
                    // state.Pi = [action];
                }
            });
            currentDelta = Math.max(currentDelta, Math.abs(maxV - oldV));
            state.V = maxV;
        });

        this.numValueIterations += 1;
        const isStable = currentDelta < theta;
        return isStable;
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
