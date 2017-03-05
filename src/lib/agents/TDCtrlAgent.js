// Write the methods of the TDAgent class as functional (pure) as possible to ease
// testing, but some functions are cumbersome to purify, e.g. reset().

import BaseCtrlAgent from './BaseCtrlAgent.js';


class TDCtrlAgent extends BaseCtrlAgent {
    constructor(env, {alpha=0.01, gamma=0.95, epsilon=0.1, lambda=0.7,
                      etraceType=null,
                      // learningAlgo='watkinsQLambda',
                      learningAlgo='sarsaLambda',
                      batchSize=50}={}) {
        super(env);
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

        // both sarsaLambda and watkinsQLambda have already specified etraceType, so
        // currently won't support using additional trace types. Control trace turns
        // out to be quite different from planning trace.
        this.etraceType = null;
        this.learningAlgo = learningAlgo;

        // for learning from multiple episodes in batch
        this.batchSize = batchSize;
        this.reset();
    }

    act() {
        // Main method for learning
        this.takeAction();

        switch (this.learningAlgo) {
        case 'sarsaLambda':
            this.sarsaLambdaUpdate();
            break;
        case 'watkinsQLambda':
            this.watkinsQLambdaUpdate();
            break;
        default:
            console.error('unimplemented learning algorithm: ' + this.learningAlgo);
        }

        this.afterUpdate();
    }

    sarsaLambdaUpdate() {
        // implement the "repeat (for each step of episode)" part of Figure
        // 7.11: Tabular Sarsa(λ)
        let {s0, a0, reward, s1, a1} = this;

        let delta = reward + this.gamma * s1.Q[a1] - s0.Q[a0];
        s0.Z[a0] += 1;

        let that = this;
        this.env.states.forEach((state) => {
            state.allowedActions.forEach((action) => {
                state.Q[action] += that.alpha * delta * state.Z[action];
                state.Z[action] *= that.gamma * that.lambda;
                state.epiHistZ[action].push(state.Z[action]);
            });
        });
    }

    watkinsQLambdaUpdate() {
        // implement the Watkins' Q(λ) in Figure 7.14
        let {s0, a0, reward, s1, a1} = this;

        let aStar = this.chooseGreedyAction(s1);
        let delta = reward + this.gamma * s1.Q[aStar] - s0.Q[a0];
        s0.Z[a0] += 1;

        let that = this;
        this.env.states.forEach((state) => {
            state.allowedActions.forEach((action) => {
                state.Q[action] += that.alpha * delta * state.Z[action];
                if (a1 === aStar) {
                    state.Z[action] *= that.gamma * that.lambda;
                } else {
                    state.Z[action] = 0;
                }
                state.epiHistZ[action].push(state.Z[action])
            });
        });
    }
};

export default TDCtrlAgent;
