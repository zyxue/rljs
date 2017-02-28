import React, {Component} from 'react';

import NumberInput from './NumberInput.jsx';
import Select from './Select.jsx';


class AgentParams extends Component {
    render() {
        const {changeHandler, spec} = this.props;

        const specElms = spec.map((sp, idx) => {
            switch (sp.specType) {
                case 'number':
                    return <NumberInput key={idx} changeHandler={this.props.changeHandler} spec={sp.spec} />;
                case 'select':
                    return <Select      key={idx} changeHandler={this.props.changeHandler} spec={sp.spec} />;
                default:
                    return null;
            }
        });

        return (
            <div>{specElms}</div>
        );
    }
}


export default AgentParams;
