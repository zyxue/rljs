import React, {Component} from 'react';

import SelectTag from './SelectTag.jsx';


class EnvDimensions extends Component {
    render () {
        let {env, updateEnv, dimOptions} = this.props;

        let allowedDimensions = dimOptions.map((i) => {
            return {value:i, text:i};
        });

        let numRowsParams = {
            label: '# rows:', attr: 'numRows', options: allowedDimensions
        };

        let numColsParams = {
            label: '# cols:', attr: 'numCols', options: allowedDimensions
        };

        return (
            <div>
                <SelectTag objectToUpdate={env} updateMethod={updateEnv} params={numRowsParams} labelNumCols={4} inputNumCols={3} />
                <SelectTag objectToUpdate={env} updateMethod={updateEnv} params={numColsParams} labelNumCols={2} inputNumCols={2} />
            </div>
        );
    }
}


EnvDimensions.defaultProps = {
    dimOptions: [3, 4, 5, 6, 7, 8, 9, 10]
};

export default EnvDimensions;
