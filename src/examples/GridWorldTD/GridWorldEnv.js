import R from '../../lib/Recurrent-js';

// Different from the ../GridWorldDP/GridWorldEnv, there is no transition or
// reward function for TD learning because it's a model-free method

var GridWorld = function({numRows=7, numCols=7,
                          cliffStateIds=[2, 9, 16, 23, 30, 37, 31, 32, 33],
                          startingStateId=0,
                          terminalStateId=3,
                          stepReward=-0.01,
                          terminalReward=1
                         }={}) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.cliffStateIds = cliffStateIds;
    this.startingStateId = startingStateId;
    this.terminalStateId = terminalStateId;

    // the reward (usually negative and hence a penalty) for taking an action
    this.stepReward = stepReward;
    // the reward for the terminal
    this.terminalReward = terminalReward;

    this.reset();
};


GridWorld.prototype = {
    reset: function() {
        let numCells = this.numCells = this.numRows * this.numCols;

        this.states = [];
        for (let ri = 0; ri < this.numRows; ri++) {
            for (let ci = 0; ci < this.numCols; ci++) {
                let id = this.xytos(ci, ri);
                this.states.push({
                    id: id,
                    x: ci,
                    y: ri,
                    reward: 0,
                    isCliff: false,
                    allowedActions: this.getAllowedActions(id),

                    // to be filled later
                    Q: {},       // state-action value
                    Z: {},       // current etrace
                    epiHistZ: {} // episodic historical etrace
                });
            }
        }

        this.states.forEach(function(state) {
            state.allowedActions.forEach(function(action) {
                state.Q[action] = 0;
                state.Z[action] = 0;
                state.epiHistZ[action] = 0;
            });
        });

        // default starting state
        this.startingState = this.states[this.startingStateId];
        // default terminal state
        // this.terminalState = this.states[Math.floor(this.numCells / 2)];
        this.terminalState = this.states[this.terminalStateId];
        this.terminalState.reward = this.terminalReward;

        let that = this;
        this.cliffStateIds.forEach((id) => {that.states[id].isCliff = true});
    },

    calcReward: function(s0, action, s1) {
        // reward of being in s, taking action a, and ending up in ns
        let reward = this.Rarr[s0];
        // every non-exit step takes a bit of negative reward
        if (!this.isTerminal(s0)) reward -= 0.01;
        return reward;
    },

    calcNextState: function(s0, action) {
        // gridworld is deterministic, so this is easy
        let s1;

        if (this.isTerminal(s0)) {
            s1 = this.initState();
        } else {
            let x = this.stox(s0);
            let y = this.stoy(s0);
            let nx, ny;
            if (action === 0) {nx = x - 1; ny = y;}
            if (action === 1) {nx = x; ny = y - 1;}
            if (action === 2) {nx = x + 1; ny = y;}
            if (action === 3) {nx = x; ny = y + 1;}
            // console.debug(x, y, nx, ny);
            s1 = this.xytos(nx, ny);
            if (this.cliffArr[s1] === 1) {
                s1 = s0;
            }
        }
        return s1;
    },

    gotoNextState: function(s0, action) {
        let s1 = this.calcNextState(s0, action);
        let reward = this.calcReward(s0, action, s1);
        return {reward: reward, nextState: s1};
    },

    isTerminal: function(state) {
        return state === this.goalState ? true : false;
    },

    getAllowedActions: function(s) {
        // var actionMapping = {
        //     0: '←',
        //     1: '↑',
        //     2: '↓',
        //     3: '→'
        // };

        let x = this.stox(s);
        let y = this.stoy(s);
        let as = [];
        if (x > 0) {
            as.push(0);
        }
        if (y > 0) {
            as.push(1);
        }
        if (x < this.numCols - 1) {
            as.push(2);
        }
        if (y < this.numRows - 1) {
            as.push(3);
        }
        return as;
    },

    randomState: function() {
        return Math.floor(Math.random() * this.numCells);
    },

    initState: function() {
        // initiate the starting state
        return 0;
    },

    getNumStates: function() {
        return this.numCells;
    },

    getMaxNumActions: function() {
        return 4;
    },

    // private functions
    stox: function(s) {
        return s % this.numCols;
    },

    stoy: function(s) {
        return Math.floor(s / this.numCols);
    },

    xytos: function(x, y) {
        return x + y * this.numCols;
    }
};


export default GridWorld;
