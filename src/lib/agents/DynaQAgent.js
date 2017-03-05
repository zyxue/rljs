import BaseCtrlAgent from './BaseCtrlAgent.js';
import {randi} from '../utils';


class DynaQAgent extends BaseCtrlAgent {
    constructor(env, {alpha=0.01,
                      gamma=0.95,
                      epsilon=0.1,
                      batchSize=200,
                      actingRate=100,

                      numSessions=10}={}) {
        super(env, {alpha: alpha, gamma: gamma, epsilon: epsilon,
                    batchSize: batchSize, actingRate: actingRate});
        this.numSessions = numSessions;

        // modeling while learning, that's dyna-Q
        // should have similar data structure as env.states except it has
        // predefined reward and next state
        this.model = {
            states: []
        };
    }

    act() {
        this.takeAction();
        this.dynaQUpdate();
        this.afterUpdate();
    }

    dynaQUpdate() {
        // implement Dyna-Q algorithm in Figure 8.4
        let {s0, a0, reward, s1} = this;

        let aStar = this.chooseGreedyAction(s1);
        let delta = reward + this.gamma * s1.Q[aStar] - s0.Q[a0];
        s0.Q[a0] += this.alpha * delta;

        // update the model
        if (this.model.states[s0.id] === undefined) {
            this.model.states[s0.id] = {
                id: s0.id,
                nextState: {}
            };
            this.model.states[s0.id].nextState[a0] = [reward, s1.id];
        } else {
            this.model.states[s0.id].nextState[a0] = [reward, s1.id];
        }

        // modeling, n times
        let counter = 0;
        while (counter < this.numSessions) {
            // r: random, m: model, e: env

            // cannot use this.model.states.length as many elements are just
            // undefined in this particular javascript array, But Object.keys()
            // only return the non-undefined keys (in string though);
            let seenStateIds = this.model.states.filter((s) => s !== undefined).map((s) => s.id);
            let rS0Id = seenStateIds[randi(0, seenStateIds.length)];
            let mS0 = this.model.states[rS0Id];
            let eS0 = this.env.states[rS0Id];

            let seenActions = Object.keys(mS0.nextState);
            let rA0 = seenActions[randi(0, seenActions.length)];
            // console.log(mS0, seenActions, rA0);
            let [mReward, rS1Id] = this.model.states[rS0Id].nextState[rA0];

            // let mS1 = this.model.states[rS1Id];
            let eS1 = this.env.states[rS1Id];

            let eAStar = this.chooseGreedyAction(eS1);
            let eDelta = mReward + this.gamma * eS1.Q[eAStar] - eS0.Q[rA0];
            eS0.Q[rA0] += this.alpha * eDelta;

            counter += 1;
        }
    }
}

export default DynaQAgent;
