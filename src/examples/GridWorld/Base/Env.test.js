import GridWorld from './Env';


it('too big terminalStateId is reduced to the last cell', () => {
    const gw = new GridWorld({
        numRows: 2,
        numCols: 3,
        terminalStateId: 100,
    });
    expect(gw.terminalStateId).toBe(5);
});


function initGridWorld() {
    // a 2x3 toy example

    // Generated with http://asciiflow.com/
    // +--------------+
    // |S  0|///1|T  2|
    // |    |////|    |
    // +--------------+
    // |   3|   4|   5|
    // |    |    |    |
    // +----+----+-----

    return new GridWorld({
        numRows: 2,
        numCols: 3,
        cliffStateIds: [1],
        startingStateId: 0,
        terminalStateId: 2,
        stepReward: -0.01,
        terminalReward: 1
    });
}

const gw = initGridWorld();

it('proper initialization', () => {
    expect(gw.numRows).toBe(2);
    expect(gw.numCols).toBe(3);
    expect(gw.numCells).toBe(6);
    expect(gw.cliffStateIds).toEqual([1]);
    expect(gw.startingStateId).toBe(0);
    expect(gw.terminalStateId).toBe(2);
    expect(gw.stepReward).toBe(-0.01);
    expect(gw.terminalReward).toBe(1);
});

describe('proper reset after initialization', () => {
    it('6 cells in total', () => {
        expect(gw.states.length).toBe(6);
    });

    it('test a non-cliff state at the bottom left corner', () => {
        expect(gw.states[3]).toEqual({
            id: 3,
            x: 0,
            y: 1,
            reward: 0,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })

    it('test a non-cliff state at the bottom right corner', () => {
        expect(gw.states[5]).toEqual({
            id: 5,
            x: 2,
            y: 1,
            reward: 0,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })

    it('test a non-cliff state to the bottom', () => {
        expect(gw.states[4]).toEqual({
            id: 4,
            x: 1,
            y: 1,
            reward: 0,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })

    it('test a cliff state', () => {
        expect(gw.states[1]).toEqual({
            id: 1,
            x: 1,
            y: 0,
            reward: 0,
            isCliff: true,
            allowedActions: []
        });
    })

    it('correct startingState', () => {
        expect(gw.states[gw.startingStateId]).toEqual({
            id: 0,
            x: 0,
            y: 0,
            reward: 0,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })

    it('correct terminalState', () => {
        expect(gw.states[gw.terminalStateId]).toEqual({
            id: 2,
            x: 2,
            y: 0,
            reward: 1,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })
});


it('calcNextState', () => {
    [
        // s0: state where action is taken
        // a:  action
        // s1: next state

        // top left corner
        {s0Id: 0, a0: 0, s1Id: 0},
        {s0Id: 0, a0: 1, s1Id: 0},
        {s0Id: 0, a0: 2, s1Id: 0},
        {s0Id: 0, a0: 3, s1Id: 3},

        // terminal state
        {s0Id: 2, a0: 0, s1Id: 0},
        {s0Id: 2, a0: 1, s1Id: 0},
        {s0Id: 2, a0: 2, s1Id: 0},
        {s0Id: 2, a0: 3, s1Id: 0},

        // bottom left corner
        {s0Id: 3, a0: 0, s1Id: 3},
        {s0Id: 3, a0: 1, s1Id: 0},
        {s0Id: 3, a0: 2, s1Id: 4},
        {s0Id: 3, a0: 3, s1Id: 3},

        // bottom center
        {s0Id: 4, a0: 0, s1Id: 3},
        {s0Id: 4, a0: 1, s1Id: 4},
        {s0Id: 4, a0: 2, s1Id: 5},
        {s0Id: 4, a0: 3, s1Id: 4},

        // bottom right corner
        {s0Id: 5, a0: 0, s1Id: 4},
        {s0Id: 5, a0: 1, s1Id: 2},
        {s0Id: 5, a0: 2, s1Id: 5},
        {s0Id: 5, a0: 3, s1Id: 5},
    ].map((obj) => {
        let {s0Id, a0, s1Id} = obj;
        // console.log(obj);
        expect(gw.calcNextState(gw.states[s0Id], a0).id).toBe(s1Id);
    })
});


it('calcReward', () => {
    gw.states.forEach((s0) => {
        s0.allowedActions.forEach((action) => {
            if (! s0.isCliff) {
                let s1 = gw.calcNextState(s0, action);
                let reward = gw.calcReward(s0, action, s1);
                if (gw.isTerminal(s0)) {
                    // exit step does not incur penalty
                    expect(reward).toBe(1);
                } else {
                    expect(reward).toBe(-0.01);
                }
            }
        });
    });
});



it('gotoNextState', () => {
    [
        // top left corner
        {s0Id: 0, a0: 0, reward: -0.01, s1Id: 0},
        {s0Id: 0, a0: 1, reward: -0.01, s1Id: 0},
        {s0Id: 0, a0: 2, reward: -0.01, s1Id: 0},
        {s0Id: 0, a0: 3, reward: -0.01, s1Id: 3},

        // terminal state
        {s0Id: 2, a0: 0, reward: 1, s1Id: 0},
        {s0Id: 2, a0: 1, reward: 1, s1Id: 0},
        {s0Id: 2, a0: 2, reward: 1, s1Id: 0},
        {s0Id: 2, a0: 3, reward: 1, s1Id: 0},

        // bottom left corner
        {s0Id: 3, a0: 0, reward: -0.01, s1Id: 3},
        {s0Id: 3, a0: 1, reward: -0.01, s1Id: 0},
        {s0Id: 3, a0: 2, reward: -0.01, s1Id: 4},
        {s0Id: 3, a0: 3, reward: -0.01, s1Id: 3},

        // bottom center
        {s0Id: 4, a0: 0, reward: -0.01, s1Id: 3},
        {s0Id: 4, a0: 1, reward: -0.01, s1Id: 4},
        {s0Id: 4, a0: 2, reward: -0.01, s1Id: 5},
        {s0Id: 4, a0: 3, reward: -0.01, s1Id: 4},

        // bottom right corner
        {s0Id: 5, a0: 0, reward: -0.01, s1Id: 4},
        {s0Id: 5, a0: 1, reward: -0.01, s1Id: 2},
        {s0Id: 5, a0: 2, reward: -0.01, s1Id: 5},
        {s0Id: 5, a0: 3, reward: -0.01, s1Id: 5},
    ].map((obj) => {
        let {s0Id, a0, reward, s1Id} = obj;
        // console.log(obj);
        expect(gw.gotoNextState(gw.states[s0Id], a0)).toEqual([reward, gw.states[s1Id]]);
    })
});


it('check if a state is a terminal state', () => {
    expect(gw.isTerminal(gw.states[0])).toBe(false);
    // cliff is not terminal
    expect(gw.isTerminal(gw.states[1])).toBe(false);
    expect(gw.isTerminal(gw.states[2])).toBe(true);
});


it('get allowed actions of a given state', () => {
    gw.states.forEach((st) => {
        let actions = gw.getAllowedActions(st);
        if (st.isCliff) {
            expect(actions).toEqual([]);
        } else {
            expect(actions).toEqual([0, 1, 2, 3]);
        }
    })
});

it('initialize state', () => {
    expect(gw.initState().id).toBe(0);
})

it('get number of states in the current gridworld', () => {
    expect(gw.getNumStates()).toBe(6);
})

it('stox: convert state Id to x coordinate', () => {
    expect(gw.stox(0)).toBe(0);
    expect(gw.stox(1)).toBe(1);
    expect(gw.stox(2)).toBe(2);
    expect(gw.stox(3)).toBe(0);
    expect(gw.stox(4)).toBe(1);
    expect(gw.stox(5)).toBe(2);
});

it('stoy: convert state Id to y coordinate', () => {
    expect(gw.stoy(0)).toBe(0);
    expect(gw.stoy(1)).toBe(0);
    expect(gw.stoy(2)).toBe(0);
    expect(gw.stoy(3)).toBe(1);
    expect(gw.stoy(4)).toBe(1);
    expect(gw.stoy(5)).toBe(1);
});

it('xytos: convert x, y coordinates to state Id', () => {
    expect(gw.xytos(0, 0)).toBe(0);
    expect(gw.xytos(1, 0)).toBe(1);
    expect(gw.xytos(2, 0)).toBe(2);
    expect(gw.xytos(0, 1)).toBe(3);
    expect(gw.xytos(1, 1)).toBe(4);
    expect(gw.xytos(2, 1)).toBe(5);
});
