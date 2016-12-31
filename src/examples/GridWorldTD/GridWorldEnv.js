import R from '../../lib/Recurrent-js';

// Different from the ../GridWorldDP/GridWorldEnv, there is no transition or
// reward function for TD learning because it's a model-free method


var GridWorld = function() {
    // reward array
    this.Rarr = null;
    // an array to store information about whether a state is a cliff,
    // 0 = normal, 1 = cliff
    this.cliffArr = null;
    this.reset();
};


GridWorld.prototype = {
    reset: function() {

        // hardcoding one gridworld for now
        this.numRows = 10;
        this.numCols = 12;
        // equivalent to number of states
        this.numCells = this.numRows * this.numCols;

        // specify some rewards
        let Rarr = R.zeros(this.numCells);
        /* cliffs */
        let cliffArr = R.zeros(this.numCells);

        let plusOneIdx = [55];
        for (let i = 0; i < plusOneIdx.length; i++) {
            Rarr[plusOneIdx[i]] = 1;
        }

        let negOneIdx = [54, 64, 65, 85, 86, 37, 33, 67, 57];
        for (let i = 0; i < negOneIdx.length; i++) {
            Rarr[negOneIdx[i]] = -1;
        }

        // make some cliffs
        for (let q = 0; q < 8; q++) {
            let off = (q + 1) * this.numRows + 2;
            cliffArr[off] = 1;
            Rarr[off] = 0;
        }

        for (let q = 0; q < 6; q++) {
            let off = 4 * this.numRows + q + 2;
            cliffArr[off] = 1;
            Rarr[off] = 0;
        }

        cliffArr[5 * this.numRows + 2] = 0;
        Rarr[5 * this.numRows + 2] = 0; // make a hole

        this.Rarr = Rarr;
        this.cliffArr = cliffArr;

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
        if (state === 55) {
            // episode is over
            return true;
        }
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
