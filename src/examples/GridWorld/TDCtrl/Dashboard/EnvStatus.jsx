import React, {Component} from 'react';

import EnvDimensions from './EnvDimensions.jsx';
import NumberInputTag from './NumberInputTag.jsx';
import SelectTag from './SelectTag.jsx';


class EnvStatus extends Component {
    render () {
        let {env, updateEnv} = this.props;

        let stepRewardParams = {
            label: 'step reward: ', attr: 'stepReward',
            min: -1, max: 1, step: 0.01, hideValue:true
        };

        return (
            <div>
                <h5>Environment:</h5>
                <EnvDimensions env={env} updateEnv={updateEnv} />
                <NumberInputTag objectToUpdate={env} updateMethod={updateEnv} params={stepRewardParams}
                                labelNumCols={4} inputNumCols={8} />
            </div>
        );
    }
}

export default EnvStatus;
