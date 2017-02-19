// This model defines the GridWorld Environment Model


// these are reasonable default for learning purpose
var GridWorld = function({numRows=7, numCols=7,
                          cliffStateIds=[2, 9, 16, 23, 30, 37, 31, 32, 33],
                          startingStateId=0,
                          terminalStateId=3,
                          stepReward=-0.01,
                          terminalReward=1
                         }={}) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.numCells = this.numRows * this.numCols;

    this.cliffStateIds = cliffStateIds;
    this.startingStateId = startingStateId;
    this.terminalStateId = Math.min(this.numCells - 1, terminalStateId);

    // the reward (usually negative and hence a penalty) for taking an action
    this.stepReward = stepReward;
    // the reward for the terminal
    this.terminalReward = terminalReward;

    this.reset();
};


GridWorld.prototype = {
    reset: function() {
        this.states = [];
        for (let ri = 0; ri < this.numRows; ri++) {
            for (let ci = 0; ci < this.numCols; ci++) {
                let id = this.xytos(ci, ri);
                let st = {
                    id: id,
                    x: ci,
                    y: ri,
                    reward: 0,
                };
                st.isCliff = (this.cliffStateIds.indexOf(st.id) !== -1 ? true : false);
                st.allowedActions = this.getAllowedActions(st);
                this.states.push(st);
            }
        }

        this.states[this.terminalStateId].reward = this.terminalReward;
    },

    getStartingState: function() {
        return this.states[this.startingStateId];
    },

    getTerminalState: function() {
        return this.states[this.terminalStateId];
    },

    calcReward: function(s0, action, s1) {
        // reward of being in s0, taking action, and ending up in s1

        // exit step does not incur penalty
        let reward = s0.reward;

        // every non-exit step takes a bit of negative reward
        if (!this.isTerminal(s0)) reward += this.stepReward;
        return reward;
    },

    calcNextState: function(s0, a0) {
        // gridworld is deterministic, so this is easy
        let s1;

        if (this.isTerminal(s0)) {
            s1 = this.initState();
        } else {
            let x = this.stox(s0.id);
            let y = this.stoy(s0.id);
            let nx, ny;
            if (a0 === 0) {nx = Math.max(x - 1, 0); ny = y;}
            if (a0 === 1) {nx = x; ny = Math.max(y - 1, 0);}
            if (a0 === 2) {nx = Math.min(x + 1, this.numCols - 1); ny = y;}
            if (a0 === 3) {nx = x; ny = Math.min(y + 1, this.numRows - 1);}
            let s1Id = this.xytos(nx, ny);
            // console.debug(a0, x, y, nx, ny, s1Id);
            s1 = this.states[s1Id];
            if (s1.isCliff) {
                s1 = s0;
            }
        }
        return s1;
    },

    gotoNextState: function(s0, a0) {
        let s1 = this.calcNextState(s0, a0);
        let reward = this.calcReward(s0, a0, s1);
        return [reward, s1];
    },

    isTerminal: function(state) {
        return state.id === this.terminalStateId ? true : false;
    },

    getAllowedActions: function(state) {
        // var actionMapping = {
        //     0: '←',
        //     1: '↑',
        //     2: '↓',
        //     3: '→'
        // };

        const as = [];
        if (! state.isCliff) {
            // Allow agent to go against towards border, but should stay put
            [0, 1, 2, 3].forEach((a) => as.push(a));

            // // NOT allow agent to go towards grid border 
            // const stateId = state.Id;
            // let x = this.stox(stateId);
            // let y = this.stoy(stateId);
            // if (x > 0) {
            //     as.push(0);
            // }
            // if (y > 0) {
            //     as.push(1);
            // }
            // if (x < this.numCols - 1) {
            //     as.push(2);
            // }
            // if (y < this.numRows - 1) {
            //     as.push(3);
            // }
        }

        return as;
    },

    randomState: function() {
        return this.states[Math.floor(Math.random() * this.numCells)];
    },

    initState: function() {
        return this.getStartingState();
    },

    getNumStates: function() {
        return this.numCells;
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
