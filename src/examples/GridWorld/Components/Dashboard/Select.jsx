import React, {Component, PropTypes} from 'react';

class Select extends Component {
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
        const {currentVal, label, spec} = this.props;

        const options = spec.options.map((opt, idx) => {
            return <option key={idx} value={opt.value}>{opt.label}</option>;
        });

        return (
            <div>
                <div>
                    <span>{label}</span>
                    <select value={currentVal}
                            onChange={this.onChange.bind(this)}>
                        {options}
                    </select>
                </div>
            </div>
        );
    }
}


Select.propTypes = {
    currentVal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    attr: PropTypes.string.isRequired,
    changeHandler: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,

    spec: PropTypes.shape({
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            label: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired
        }))
    }).isRequired
};

Select.defaultProps = {
};


export default Select;
