import React, {Component} from 'react';

import Params from './Params.jsx';


class EnvStatus extends Component {
    render () {
        let {env, envParamSpecs, updateEnvHandler} = this.props;

        // apply the currentVal for each attribute
        envParamSpecs.forEach((sp) => {
            sp['currentVal'] = env[sp.attr];

        });

        return (
            <div>
                <h5>Environment:</h5>
                <Params specs={envParamSpecs} object={env} changeHandler={updateEnvHandler.bind(this)} />
            </div>
        );
    }
}


EnvStatus.defaultProps = {
    envParamSpecs: [
        {
            specType: 'select',
            label: '# rows',
            attr: 'numRows',
            spec: {
                options: [3, 4, 5, 6, 7, 8, 9, 10].map((v) => {return {value:v, label: v};})
            }
        },
        {
            specType: 'select',
            label: '# cols',
            attr: 'numCols',
            spec: {
                options: [3, 4, 5, 6, 7, 8, 9, 10].map((v) => {return {value:v, label: v};})
            }
        },
        {
            specType: 'number',
            label: 'step reward: ',
            attr: 'stepReward',
            spec: {
                min: -1, max: 1, step: 0.01}
        },

        // adding slip seems to make the problem much more complicated, even
        // just for DP, think about it later

        /* {
         *     specType: 'number',
         *     spec: {label: 'slip Prob.: ', attr: 'slipProb', min: 0, max: 1, step: 0.01, hideValue: true}
         * }*/

    ]
};



export default EnvStatus;
