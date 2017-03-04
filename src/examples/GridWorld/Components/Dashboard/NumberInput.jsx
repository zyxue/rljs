import React, {Component, PropTypes} from 'react';


class NumberInput extends Component {
    render () {
        // obj includes information necessary for rendering this component
        // accordingly
        let {changeHandler, object, spec} = this.props;
        return (
            <div>
                <div>
                    <span>{spec.label}</span>
                    <span className="text-primary">
                        {spec.hideValue ? null : object[spec.attr]}
                    </span>
                </div>
                <div>
                    <div>
                        <input type="number" min={spec.min} max={spec.max} step={spec.step}
                               value={object[spec.attr]} 
                               onChange={changeHandler.bind(this, object, spec.attr, spec.attrType)}/>
                    </div>
                </div>
            </div>
        );
    }
}

NumberInput.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    spec: PropTypes.shape({
        label: PropTypes.string.isRequired,
        attr: PropTypes.string.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        hideValue: PropTypes.bool
    }).isRequired
};

NumberInput.defaultProps = {
};


export default NumberInput;
