import React, {Component} from 'react';

import NumberInput from './NumberInput.jsx';
import Select from './Select.jsx';

import './Params.css';


class Params extends Component {
    render() {
        const {changeHandler, specs} = this.props;

        const specElms = specs.map((sp, idx) => {
            switch (sp.specType) {
                case 'number':
                    return (
                        <div className="param">
                            <NumberInput key={idx}
                                         className="param"
                                         currentVal={sp.currentVal}
                                         attr={sp.attr}
                                         changeHandler={changeHandler}
                                         label={sp.label}
                                         spec={sp.spec} />
                        </div>
                    );
                case 'select':
                    return (
                        <div className="param">
                            <Select      key={idx}
                                         className="param"
                                         currentVal={sp.currentVal}
                                         attr={sp.attr}
                                         changeHandler={changeHandler}
                                         label={sp.label}
                                         spec={sp.spec} />
                        </div>
                    );
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
