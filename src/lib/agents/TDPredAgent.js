import {randi} from '../utils.js';


let TDPredAgent = function(env, {alpha=0.01, gamma=0.95, lambda=0.7,
                                 etraceType='accumulatingTrace',
                                 batchSize=50}={}) {
    // store pointer to environment
    this.env = env;

    // learning rate
    this.alpha = alpha;
    // return discount factor
    this.gamma = gamma;
    // Trace-decay parameter as in TD(λ)
    this.lambda = lambda;

    // currently only one algorithm available for TD prediction
    this.learningAlgo = 'tdLambda';

    // accumulatingTrace or replacingTrace
    this.etraceType = etraceType;

    this.batchSize = batchSize;
    this.reset();
};


TDPredAgent.prototype = {
    reset: function(){
        this.env.states.forEach((st) => {
            st.V = 0;
        });

        // for keeping learning progress
        this.numEpisodesExperienced = 0;
        this.numStepsPerEpisode = []; // record how number decreases;
        this.numTotalSteps = 0; // record how number decreases;

        // reset episode level variables
        this.resetEpisode();
    },

    resetEpisode: function() {
        // reset epsiode level variables
        this.numStepsCurrentEpisode = 0;
        // reset etrace history
        this.env.states.forEach((st) => {
            st.Z = 0;
            st.epiHistZ = [];
        });
        this.s0 = this.env.initState();
        this.a0 = this.chooseAction(this.s0);
    },

    takeRandomAction: function(s0) {
        let randomInt = randi(0, s0.allowedActions.length);
        return s0.allowedActions[randomInt];
    },

    chooseAction: function(state) {
        return this.takeRandomAction(state);
    },

    updateTrace: function(z, etraceType) {
        switch(etraceType) {
            case 'accumulatingTrace':
                return z + 1;
            case 'replacingTrace':
                return 1;
            default:
                return z; // do nothing
        }
    },

    tdLambdaAct: function() {
        // implement 7.7: On-line Tabular TD(λ)

        let s0 = this.s0;
        let a0 = this.a0;

        let [reward, s1] = this.env.gotoNextState(s0, a0);
        let a1 = this.chooseAction(s1);

        let delta = reward + this.gamma * s1.V - s0.V;
        s0.Z = this.updateTrace(s0.Z, this.etraceType);

        let that = this;
        this.env.states.forEach((st, idx, arr) => {
            st.V += that.alpha * delta * st.Z;
            st.Z *= that.gamma * that.lambda;
            st.epiHistZ.push(st.Z);
        });

        if (this.env.isTerminal(this.s0)) {
            // finish one episode
            this.numEpisodesExperienced += 1;
            this.numStepsPerEpisode.push(this.numStepsCurrentEpisode);
            this.resetEpisode();
        } else {
            this.s0 = s1;
            this.a0 = a1;
            this.numStepsCurrentEpisode += 1;
            this.numTotalSteps += 1;
        }
    },

    act: function() {
        this.tdLambdaAct();
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

export default TDPredAgent;
