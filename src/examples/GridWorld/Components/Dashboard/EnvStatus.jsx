import React, {Component} from 'react';

import Params from './Params.jsx';


class EnvStatus extends Component {
    render () {
        let {env, envParamSpecs, updateEnvHandler} = this.props;

        // apply the currentVal for each attribute
        envParamSpecs.forEach((spec) => {
            spec.spec['currentVal'] = env[spec.spec.attr];
        });

        return (
            <div>
                <h5>Environment:</h5>
                <Params specs={envParamSpecs} changeHandler={updateEnvHandler.bind(this)} />
            </div>
        );
    }
}


EnvStatus.defaultProps = {
    envParamSpecs: [
        {
            specType: 'select',
            spec: {
                label: '# rows',
                attr: 'numRows',
                options: [3, 4, 5, 6, 7, 8, 9, 10].map((v) => {return {value:v, label: v};})
            }
        },
        {
            specType: 'select',
            spec: {
                label: '# cols',
                attr: 'numCols',
                options: [3, 4, 5, 6, 7, 8, 9, 10].map((v) => {return {value:v, label: v};})
            }
        },
        {
            specType: 'number',
            spec: {label: 'step reward: ', attr: 'stepReward', min: -1, max: 1, step: 0.01, hideValue: true}
        }
    ]
};



export default EnvStatus;
