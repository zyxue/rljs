import R from '../Recurrent-js';


let TDPredAgent = function(env, {alpha=0.01, gamma=0.95, epsilon=0.1, lambda=0.7, batchSize=200}={}) {
    // store pointer to environment
    this.env = env;

    // learning rate
    this.alpha = alpha;
    // return discount factor
    this.gamma = gamma;
    // for epsilon-greedy policy
    this.epsilon = epsilon;
    // Trace-decay parameter as in TD(λ)
    this.lambda = lambda;

    this.learningAlgo = 'tdLambda';

    // for learning from multiple episodes in batch
    this.batchSize = batchSize;
    this.reset();
};


TDPredAgent.prototype = {
    reset: function(){
        this.env.states.forEach((st) => {
            st.V = 0;
            st.Z = 0;
        });

        // for keeping learning progress
        this.numEpisodesExperienced = 0;
        this.numStepsPerEpisode = []; // record how number decreases;

        // reset episode level variables
        this.resetEpisode();
    },

    resetEpisode: function() {
        // reset epsiode level variables
        this.numStepsCurrentEpisode = 0;
        // reset etrace history
        this.env.states.forEach((st) => {
            st.epiHistZ = [];
        });
        this.s0 = this.env.initState();
        this.a0 = this.chooseAction(this.s0);
    },

    takeRandomAction: function(s0) {
        let randomInt = R.randi(0, s0.allowedActions.length);
        return s0.allowedActions[randomInt];
    },

    takeGreedyAction: function(s0) {
        let a0 = s0.allowedActions[0];
        let [rew, s1] = this.env.gotoNextState(s0, a0);
        let val = s1.V;
        for (let i=1; i < s0.allowedActions.length; i++) {
            let currAction = s0.allowedActions[i];
            let [_rew, _s1] = this.env.gotoNextState(s0, currAction);
            if (_s1.V > val) {
                val = _s1.V;
                a0 = currAction;
            }
        }
        return a0;
    },

    chooseAction: function(state) {
        if (Math.random() < this.epsilon) {
            return this.takeRandomAction(state);
        } else {
            return this.takeGreedyAction(state);
        }
    },

    tdLambdaAct: function() {
        // implement 7.7: On-line Tabular TD(λ)

        let s0 = this.s0;
        let a0 = this.a0;

        let [reward, s1] = this.env.gotoNextState(s0, a0);
        let a1 = this.chooseAction(s1);

        this.numStepsCurrentEpisode += 1;

        let delta = reward + this.gamma * s1.V - s0.V;
        s0.Z = s0.Z + 1;

        let that = this;
        this.env.states.forEach((st, idx, arr) => {
            st.V = st.V + that.alpha * delta * st.Z;
            st.Z = that.gamma * that.lambda * st.Z
            st.epiHistZ.push(st.Z);
        })

        if (this.env.isTerminal(s0)) {
            this.numEpisodesExperienced += 1;
            this.numStepsPerEpisode.push(this.numStepsCurrentEpisode);
            this.resetEpisode();
        } else {
            this.s0 = s1;
            this.a0 = a1;
        }
    },

    act: function() {
        this.tdLambdaAct()
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
};

export default TDPredAgent;
