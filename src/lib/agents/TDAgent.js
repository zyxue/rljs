import R from '../Recurrent-js';
// import {setConst, getopt, sampleWeighted} from '../utils';
import {getopt} from '../utils';



let TDAgent = function(env, gamma=0.95, epsilon=0.1, alpha=0.01, lambda=0.3, batchSize=200) {
    // store pointer to environment
    this.env = env;

    // future reward discount factor
    this.gamma = gamma;
    // for epsilon-greedy policy
    this.epsilon = epsilon;
    // value function learning rate
    this.alpha = alpha;

    // sarsa(lambda)
    this.lambda = lambda;

    this.batchSize = batchSize;
    this.reset();
};


TDAgent.prototype = {
    reset: function(){
        // this number of states the agent could be at
        this.numStates = this.env.getNumStates();
        // this maximum number of actions the agent could take
        this.maxNumActions = this.env.getMaxNumActions();

        let arraySize = this.numStates * this.maxNumActions;
        this.Q = R.zeros(arraySize); // state-action value function
        this.Z = R.zeros(arraySize); // eligibility trace

        // needed for drawing grid
        this.Pi = R.zeros(arraySize); // policy
        this.V = R.zeros(arraySize);  // state value function

        // for keeping learning progress
        this.numEpisodesExperienced = 0;
        this.numStepsPerEpisode = []; // record how number decreases;

        this.resetEpisode();
    },

    _getIdx: function(s, a) {
        return s * this.maxNumActions + a;
    },

    getQ: function(s, a) {
        let idx = this._getIdx(s, a);
        return this.Q[idx];
    },

    chooseAction: function(state) {
        let allowedActions = this.env.getAllowedActions(state);

        let action;
        if (Math.random() < this.epsilon) {
            // take a random action
            let randomInt = R.randi(0, allowedActions.length);
            action = allowedActions[randomInt];
        } else {
            let greedyAction = allowedActions[0];
            let qVal = this.Q[this._getIdx(state, greedyAction)];
            for (let i=1; i < allowedActions.length; i++) {
                let currAction = allowedActions[i];
                let _qVal = this.Q[this._getIdx(state, currAction)];
                if (_qVal > qVal) {
                    qVal = _qVal;
                    greedyAction = currAction;
                }
            }
            action = greedyAction;
        }
        return action;
    },

    resetEpisode() {
        // reset epsiode level variables
        this.numStepsCurrentEpisode = 0;
        this.s0 = this.env.initState();
        this.a0 = this.chooseAction(this.s0);
    },

    act: function() {
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
