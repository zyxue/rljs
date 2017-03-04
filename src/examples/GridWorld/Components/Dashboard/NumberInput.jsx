import React, {Component, PropTypes} from 'react';


class NumberInput extends Component {
    onChange(event) {
        let newVal;
        switch (typeof this.props.currentVal) {
            case 'number':
                newVal = Number(event.target.value);
                break;
            case 'string':
                newVal = event.target.value;
                break;
            default:
                newVal = event.target.value;
        }
        this.props.changeHandler(this.props.attr, newVal);
    }

    render () {
        // obj includes information necessary for rendering this component
        // accordingly
        let {currentVal, attr, changeHandler, label, spec} = this.props;
        return (
            <div>
                <div>
                    <span>{label}</span>
                    <span className="text-primary">
                        {spec.hideValue ? null : currentVal}
                    </span>
                </div>
                <div>
                    <div>
                        <input type="number" min={spec.min} max={spec.max} step={spec.step}
                               value={currentVal} 
                               onChange={this.onChange.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

NumberInput.propTypes = {
    currentVal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    attr: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    spec: PropTypes.shape({
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        hideValue: PropTypes.bool
    }).isRequired
};

NumberInput.defaultProps = {
};


export default NumberInput;
