import {randi} from '../utils.js';

// Summary of DP methods:

// policy iteration includes policy evaluation and policy improvement

// value iteration includes value converge (very similar to policy evaluation
// except for a max operation) and policy generation, which is relatively
// trivial

const THETA = 1e-7;             // for testing convergence
const NUM_PREC = 7;             // for comparison of float.toPrecision

const DPAgent = function(env, {gamma=0.95, batchSize=200}={}) {
    // store pointer to environment
    this.env = env;

    // return discount factor
    this.gamma = gamma;

    this.reset();
};


DPAgent.prototype = {
    reset: function() {
        this.resetValueFunction();
        this.deltasPolIter = [];
        this.deltasValIter = [];
        this.numPolicyIterations = 0;
        this.numValueIterations = 0;
    },

    resetValueFunction: function() {
        this.env.states.forEach(function(state) {
            state.V = 0;
            // could store multiple actions if they are of the same value
            state.Pi = state.allowedActions;
        });
    },

    evaluatePolicy: function() {
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
            this.deltasPolIter.push(currentDelta);
            if (currentDelta < THETA) {break;}
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
            let maxValStr = maxVal.toPrecision(NUM_PREC);

            let actionsToMaxVals = []; // actions that leads to max value
            actionVals.forEach(([action, val]) => {
                if (val.toPrecision(NUM_PREC) == maxValStr) {
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

        this.deltasValIter.push(currentDelta);
        this.numValueIterations += 1;
        const isStable = currentDelta < THETA;
        return isStable;
    }
};

export default DPAgent;
