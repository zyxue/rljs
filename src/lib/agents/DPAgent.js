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
        this.numPolEvalSweeps = 0;
        // this.numPolEvals = 0;
        // this.numPolicyUpdates = 0;
        // this.numPolicyIters = 0;
        this.numValFuncOptimizationSweeps = 0;

    },

    resetValueFunction: function() {
        this.env.states.forEach(function(state) {
            state.V = 0;
            // could store multiple actions if they are of the same value
            state.Pi = state.allowedActions;
        });
    },

    evaluatePolicySweep: function() {
        let delta = 0;
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
            delta = Math.max(delta, Math.abs(newV - oldV));
            state.V = newV;
        });

        this.numPolEvalSweeps += 1;
        this.deltasPolIter.push(delta);
        return delta;
    },

    evaluatePolicy: function() {
        while (true) {
            let delta = this.evaluatePolicySweep();
            if (this.isConverged(delta, THETA)) break;
        }
    },

    updatePolicy: function() {
        this.env.states.forEach((state) => {
            if (state.allowedActions.length === 0) return;

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

            state.Pi = actionsToMaxVals;
        });
    },

    iteratePolicy: function() {
        while (true) {
            this.evaluatePolicy();

            // not really care about efficiency of the code for now
            const currentPi = this.collectPolicies();
            this.updatePolicy();
            const newPi = this.collectPolicies();

            if (this.areTheSamePolicies(currentPi, newPi)) break;
        }
    },

    collectPolicies: function() {
        return this.env.states.map((st) => {return st.Pi;});        
    },

    areTheSamePolicies: function(p1Array, p2Array) {
        if (p1Array.length !== p2Array.length) return false;

        for (let i=0; i < p1Array.length; i++) {
            if (this.areTheSamplePoliciesPerState(p1Array[i], p2Array[i])) {
                return false;   
            }
        }
        return true;
    },

    areTheSamePoliciesPerState: function(p1, p2) {
        // compare two policies and see if they are the same
        if (p1.length !== p2.length) return false;

        const sp1 = p1.sort();
        const sp2 = p2.sort();
        for (let i=0; i < sp1,length; i++) {
            if (sp1[i] !== sp2[i]) return false;
        }
        return true;
    },

    optimizeValueFunctionSweep: function() {
        let delta = 0;
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
            delta = Math.max(delta, Math.abs(maxV - oldV));
            state.V = maxV;
        });

        this.deltasValIter.push(delta);
        this.numValFuncOptimizationSweeps += 1;
        return delta;
    },

    optimizeValueFunction: function() {
        while (true) {
            let delta = this.optimizeValueFunctionSweep();
            if (this.isConverged(delta, THETA)) break;
        }
    },

    iterateValue: function() {
        this.optimizeValueFunction();
        this.updatePolicy();
    },

    isConverged: function(delta, cutoff) {
        return delta < cutoff;
    }
};

export default DPAgent;
