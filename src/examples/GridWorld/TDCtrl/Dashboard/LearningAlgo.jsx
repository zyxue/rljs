import React, {Component} from 'react';
import SelectTag from './SelectTag.jsx';


class LearningAlgo extends Component {
    render () {
        let {agent, updateAgent} = this.props;
        let params = {
            label: 'learning algo:', attr: 'learningAlgo', options: [
                {value: 'watkinsQLambda', text: 'Watkins’s Q(λ)'},
                {value: 'sarsaLambda', text: 'Sarsa(λ)'}
            ]
        };

        return (
            <div>
                <SelectTag objectToUpdate={agent} updateMethod={updateAgent} params={params} />
            </div>
        );
    }
}

export default LearningAlgo;
