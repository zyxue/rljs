import React, {Component} from 'react';

import NumberInput from './NumberInput.jsx';
import Select from './Select.jsx';


class Params extends Component {
    render() {
        const {changeHandler, specs} = this.props;

        const specElms = specs.map((sp, idx) => {
            switch (sp.specType) {
                case 'number':
                    return <NumberInput key={idx}
                                        currentVal={sp.currentVal}
                                        attr={sp.attr}
                                        changeHandler={changeHandler}
                                        label={sp.label}
                                        spec={sp.spec} />;
                case 'select':
                    return <Select      key={idx}
                                        currentVal={sp.currentVal}
                                        attr={sp.attr}
                                        changeHandler={changeHandler}
                                        label={sp.label}
                                        spec={sp.spec} />;
                default:
                    return null;
            }
        });

        return (
            <div>{specElms}</div>
        );
    }
}


export default Params;
