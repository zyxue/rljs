import R from '../Recurrent-js';
// import {setConst, getopt, sampleWeighted} from '../utils';
import {getopt} from '../utils';



let TDAgent = function(env, opt) {
    // store pointer to environment
    this.env = env;

    // future reward discount factor
    this.gamma = getopt(opt, 'gamma', 0.75);
    // for epsilon-greedy policy
    this.epsilon = getopt(opt, 'epsilon', 0.1);
    // value function learning rate
    this.alpha = getopt(opt, 'alpha', 0.01);

    // sarsa(lambda)
    this.lambda = getopt(opt, 'lambda', 0);
    this.Q = null;              // state-action value function
    this.Z = null               // eligibility trace

    // needed for drawing grid
    this.Pi = null;             // policy
    this.V = null;              // state value function

    this.reset();
};


TDAgent.prototype = {
    reset: function(){
        // this number of states the agent could be at
        this.numStates = this.env.getNumStates();
        // this maximum number of actions the agent could take
        this.maxNumActions = this.env.getMaxNumActions();

        let arraySize = this.numStates * this.maxNumActions;
        this.Q = R.zeros(arraySize);
        this.Z = R.zeros(arraySize);
        this.Pi = R.zeros(arraySize);
        this.V = R.zeros(arraySize);

        this.s0 = this.env.initState();
        this.a0 = this.chooseAction(this.s0);
    },

    resetEpisode: function() {
        // an episode finished
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

    act: function() {
        // implement the "repeat (for each step of episode)" part of Figure
        // 7.11: Tabular Sarsa(λ)

        let s0 = this.s0;
        let a0 = this.a0;

        let res = this.env.gotoNextState(s0, a0);
        let reward = res.reward;
        let s1 = res.nextState;
        let a1 = this.chooseAction(s1);
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

        this.s0 = s1;
        this.a0 = a1;
    },

    learnFromOneEpisode: function(r1) {
        let counter = 0;
        while (! this.env.isTerminal(this.s0)) {
            // console.log(counter, this.s0, this.a0, actionMapping[this.a0]);

            this.act();

            counter += 1;
            if (counter > 5000) {
                console.log('taking too long to end one episode: > ' + counter + ' steps.');
                break;
            }
        }

        // equivalent to exit at terminal state
        this.act();

        console.log('learned from one episode (' + counter + ' steps).');
    },

    learn: function(r1) {
        // var actionMapping = {
        //     0: '←',
        //     1: '↑',
        //     2: '↓',
        //     3: '→'
        // };

        let counter = 0;
        while (! this.env.isTerminal(this.s0)) {
            // console.log(counter, this.s0, this.a0, actionMapping[this.a0]);

            this.act();

            counter += 1;
            if (counter > 1000) break;
        }

        // reset s0, a0 after one episode
        this.s0 = this.env.initState();
        this.a0 = this.chooseAction(this.s0);

        console.log('learned from One episode');
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
