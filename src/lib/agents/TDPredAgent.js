import BaseAgent from './BaseAgent.js';


class TDPredAgent extends BaseAgent {
    constructor(env, {alpha=0.01, gamma=0.95, lambda=0.7,
                      etraceType='accumulatingTrace',
                      batchSize=50}={}) {
        super(env);
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
    }


    resetEpisode() {
        // reset epsiode level variables
        this.numStepsCurrentEpisode = 0;
        this.s0 = this.env.initState();
        this.a0 = this.chooseAction(this.s0);
        this.resetTrace();
    }

    resetValueFunction() {
        this.env.states.forEach((st) => {
            st.V = 0;
        });
    }

    resetTrace() {
        this.env.states.forEach((st) => {
            st.Z = 0;
            st.epiHistZ = [];
        });
    }

    chooseAction(state) {
        return this.chooseRandomAction(state);
    }

    updateTrace(z, etraceType) {
        switch(etraceType) {
            case 'accumulatingTrace':
                return z + 1;
            case 'replacingTrace':
                return 1;
            default:
                return z; // do nothing
        }
    }

    tdLambdaUpdate() {
        // implement 7.7: On-line Tabular TD(λ)
        let delta = this.reward + this.gamma * this.s1.V - this.s0.V;
        this.s0.Z = this.updateTrace(this.s0.Z, this.etraceType);

        let that = this;
        this.env.states.forEach((st, idx, arr) => {
            st.V += that.alpha * delta * st.Z;
            st.Z *= that.gamma * that.lambda;
            st.epiHistZ.push(st.Z);
        });
    }

    act() {
        this.takeAction();
        this.tdLambdaUpdate();
        this.afterUpdate();
    }

};

export default TDPredAgent;
