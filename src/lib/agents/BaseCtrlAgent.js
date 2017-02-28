import BaseAgent from './BaseAgent.js';


class BaseCtrlAgent extends BaseAgent {
    constructor(env, {alpha=0.01,
                      gamma=0.95,
                      epsilon=0.1,

                      batchSize=200
                     }={}) {
        super(env);
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
        this.reset();
    }

    resetEpisode() {
        // reset epsiode level variables
        this.numStepsCurrentEpisode = 0;
        this.s0 = this.initState(this.env);
        this.a0 = this.chooseAction(this.s0, this.epsilon);
        this.reward = 0;
        this.s1 = null;
        this.a1 = null;
        this.resetTrace();
    }

    resetValueFunction() {
        this.env.states.forEach(function(state) {
            state.Q = {};        // state-action value
            state.allowedActions.forEach(function(action) {
                state.Q[action] = 0;
            });
        });
    }

    resetTrace() {
        // reset eligibility trace
        this.env.states.forEach(function(state) {
            state.Z = {};        // current etrace
            state.epiHistZ = {}; // episodic historical etrace
            state.allowedActions.forEach(function(action) {
                state.Z[action] = 0;
                state.epiHistZ[action] = [];
            });
        });
    }

    chooseAction(state) {
        return this.chooseEpsilonGreedyAction(state);
    }
};

export default BaseCtrlAgent;
