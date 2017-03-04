import React, {Component, PropTypes} from 'react';

class Select extends Component {
    onChange(event) {
        this.props.changeHandler(this.props.attr, event.target.value);
    }

    render () {
        const {currentVal, attr, changeHandler, label, spec} = this.props;

        const options = spec.options.map((opt, idx) => {
            return <option key={idx} value={opt.value}>{opt.label}</option>;
        });

        return (
            <div>
                <div>
                    <span>{spec.label}</span>
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
