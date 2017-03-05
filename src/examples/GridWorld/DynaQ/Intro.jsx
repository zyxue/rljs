import React from 'react';


class Intro extends React.Component {
    render() {
        return (
            <div>
                <h4>Instruction:</h4>
                <p>Dyna-Q also converges, but much less efficient and seems more divergent than SARSA & Q-learning....</p>

                <ul>
                    <li>Act: take one action</li>
                    <li>Toggle: Take actions continously indefinitely</li>
                    <li>Learn: Learn from a batch of episodes, where batch size is tunable</li>
                </ul>


                <ul>
                    <li>The agent always starts at initial state, and then try to navigate to the goal state. At each state, the agent has 4 actions. If it hits the walls or edges, it will stay put.</li>
                    <li>Arrows show the direction of greedy action, when the policy converges, it should lead directly to the goal state, which is also reflected by the green color of triangle</li>
                    <li>Try toggle after learned from a few hundreds of episode and see how eligbility trace changes. Also play with λ, and see how it affects the trace. The x axis of trace is the number of states times that of actions. </li>
                    <li>Gridworld is deterministic! </li>
                    <li>Trace-decay parameter (λ)</li>
                </ul>


                <p>Try hit learn button if you don't see much going on.</p>
                <p>Currently, only standard SARSA(λ) is implemented. Colors of each Q triangle reflect its learn values.</p>
                <p>Reward shown in the legend does not include per step penalty</p>
            </div>
        );
    }
}


export default Intro;
