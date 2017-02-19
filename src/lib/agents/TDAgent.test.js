import TDAgent from './TDAgent';
import GridWorld from '../../examples/GridWorld/Base/Env';

// the way of how to mock utils.randi is learned from
// http://stackoverflow.com/questions/40465047/how-can-i-mock-an-es6-module-import-using-jest
import * as utils from '../utils';
utils.randi = jest.fn();


const STARTING_STATE_ID = 3;
const TERMINAL_STATE_ID = 2;

// a 3x3 toy example
// Generated with http://asciiflow.com/
// +--------------+
// |   0|   1|T  2|
// |    |    |    |
// +--------------+
// |S  3|///4|   5|
// |    |////|    |
// +--------------+
// |   6|   7|   8|
// |    |    |    |
// +----+----+----+
const env = new GridWorld({
    numRows: 3,
    numCols: 3,
    cliffStateIds: [4],
    startingStateId: STARTING_STATE_ID,
    terminalStateId: TERMINAL_STATE_ID,
    stepReward: -0.01,
    terminalReward: 1
});

const agent = new TDAgent(env, {alpha:0.02, gamma:0.99, epsilon:0.2, lambda:0.9});

describe('proper initialization', () => {
    it('a pointer to env should be attached to the agent', () => {
        expect(agent.env).toEqual(env);
    });
    
    it('agent received specified greek-letter parameters which may be different than and over write default ones', () => {
        expect(agent.alpha).toBeCloseTo(0.02);
        expect(agent.gamma).toBeCloseTo(0.99);
        expect(agent.epsilon).toBeCloseTo(0.2);
        expect(agent.lambda).toBeCloseTo(0.9);
    });

    it('agent uses default type of learning algorithm', () => {
        expect(agent.learningAlgo).toBe('watkinsQLambda');
    });

    // // these two may not be stable, untested for now
    // expect(agent.batchSize).toBe(200);
    // expect(agent.actingRate).toBe(100);

    describe('proper agent reset', () => {
        describe('proper value function reset', () => {
            it('for 1st state', () => {
                const st = agent.env.states[0];
                expect(st.Q).toEqual({0:0, 1:0, 2:0, 3:0});
            });

            it('for all states', () => {
                expect(agent.env.states.forEach(function(st) {
                    if (st.allowedActions.length > 0) {
                        expect(st.Q).toEqual({0:0, 1:0, 2:0, 3:0});
                    } else {
                        // it's a cliff in the case of gridworld
                        expect(st.Q).toEqual({});
                    }
                }));
            });
        });
        
        describe('proper reset of other parameters', () => {
            it('number of expisodes experienced should be 0', () => {
                expect(agent.numEpisodesExperienced).toBe(0);    
            });
            
            it('the array of numbers of steps per episode collected should be empty', () => {
                expect(agent.numStepsPerEpisode).toEqual([]);    
            });
        });

        describe('proper espisode reset', () => {
            it('number of steps for current episode should be 0', () => {
                expect(agent.numStepsCurrentEpisode).toBe(0);    
            });

            it('agent should be at the initial state', () => {
                expect(agent.s0.id).toBe(STARTING_STATE_ID);
            });

            it('agent should have an action to choose, selected from a given policy', () => {
                expect(agent.a0).not.toBeNull();    
            });

            it('agent should have a collected reward of 0', () => {
                expect(agent.reward).toBe(0);    
            });

            it("agent's next state and next action should be null", () => {
                expect(agent.s1).toBeNull();
                expect(agent.a1).toBeNull();
            });
        });
    });
});


it('choose a random action (1)', () => {
    utils.randi.mockReturnValue(1);

    // only mock the relevant parts
    const mockState = {allowedActions: ['a0', 'a1']};
    const action = agent.chooseRandomAction(mockState);
    expect(utils.randi).toBeCalledWith(0, 2);
    expect(action).toBe('a1');
});


it('choose a random action (2)', () => {
    utils.randi.mockReturnValue(2);

    const mockState = {allowedActions: ['a0', 'a1', 'a2']};
    const action = agent.chooseRandomAction(mockState);
    expect(utils.randi).toBeCalledWith(0, 3);
    expect(action).toBe('a2');
});


it('choose a greedy action (1)', () => {
    const mockState = {
        allowedActions: ['a0', 'a1', 'a2'],
        Q: {
            a0: 0,
            a1: 1,
            a2: 2
        }
    };
    for (let i of [0, 1, 2]) {
        utils.randi.mockReturnValue(i);
        expect(agent.chooseGreedyAction(mockState)).toBe('a2');
    }
});


it('choose a greedy action (2), starting from the bigger one', () => {
    utils.randi.mockReturnValue(0);
    const mockState = {
        allowedActions: ['a0', 'a1'],
        Q: {
            a0: 2,
            a1: 1,
        }
    };
    expect(agent.chooseGreedyAction(mockState)).toBe('a0');
});


it('choose a greedy action (3), starting from the smaller one', () => {
    utils.randi.mockReturnValue(1);
    const mockState = {
        allowedActions: ['a0', 'a1'],
        Q: {
            a0: 2,
            a1: 1,
        }
    };
    expect(agent.chooseGreedyAction(mockState)).toBe('a0');
});


// Found the other methods are still very difficult to test... and need to learn
// more mocking for testing complex object such as this agent.

