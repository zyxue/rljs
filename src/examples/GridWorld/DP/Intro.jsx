import React from 'react';


class Intro extends React.Component {
    render() {
        return (
            <div>
                <h4>Instruction:</h4>
                <p>
                  <strong>Policy itertion</strong> is basically iterative
                  actions of evaluating policy and updating policy till the
                  policy converges.
                </p>

                <p>
                  <strong>Value itertion</strong> is basically continuous update
                  of value functions till convergene, the one step of policy
                  update will result in the optimal policy
                </p>

                <p>More to be written, stay tuned. :)</p>
            </div>
        );
    }
}


export default Intro;


// <p>In general, value itertion is much slower that policy iteration. In other words, policy converges much faster than value functions. In the case of gridword, the former takes over 100 iteration while the later takes less than 10.</p>
