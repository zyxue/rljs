import React, {Component} from 'react';

import NumberInputTag from './NumberInputTag.jsx';
import SelectTag from './SelectTag.jsx';


export class GreekLetterParams extends Component {
    // parameters critical to the learning algorithm

    render () {
        let params =             [
            // attr: the attribute to change of the agent
            {label: 'α = ', attr: 'alpha',   min: 0, max: 10, step: 0.01},
            {label: 'γ = ', attr: 'gamma',   min: 0, max: 1, step: 0.01},
            {label: 'ε = ', attr: 'epsilon', min: 0, max: 1, step: 0.01},
            {label: 'λ = ', attr: 'lambda',  min: 0, max: 1, step: 0.01},
        ];

        let inputs = params.map((params) => {
            return (<NumberInputTag key={params.attr}
                                    objectToUpdate={this.props.agent}
                                    updateMethod={this.props.updateAgent}
                                    params={params} />);
        })

        return (
            <div>{inputs}</div>
        );
    }
}

export class OtherParams extends Component {
    // other parameters of the agent in general
    render () {
        let params = [
            // hideValue can be a bad design
            {label: 'batch size:', attr: 'batchSize',   min: 1, max: 2000, step: 10, hideValue:true},
            // in microseconds
            {label: 'acting rate:', attr: 'actingRate',   min: 1, max: 10000, step: 10, hideValue:true},
        ];

        let inputs = params.map((params) => {
            return (<NumberInputTag key={params.attr}
                                    objectToUpdate={this.props.agent}
                                    updateMethod={this.props.updateAgent}
                                    params={params} />);
        })

        return (
            <div>{inputs}</div>
        );
    }
}

