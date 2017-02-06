import * as utils from './utils.js';


test('zeros', () => {
    expect(utils.zeros(2)).toEqual([0, 0]);
});

test('random integer generator between 0 and 1', () => {
    let int = utils.randi(0, 1);
    expect(int).toBeGreaterThanOrEqual(0);
    expect(int).toBeLessThan(1);
});

test('random integer generator to be 1', () => {
    let int = utils.randi(1, 1);
    expect(int).toBe(1);
});


// it('sampleWeighted', () => {
//     console.log(RL.sampleWeighted);
//     expect(RL.sampleWeighted([0.5, 0.5])).toEqual(1);
//     expect(RL.sampleWeighted([0, 0])).toEqual(1);
// });


// it('evalutePolicy'), () => {
//     let agent = RL.DPAgent
// }
