import React, {Component, PropTypes} from 'react';

class Select extends Component {
    render () {
        let {changeHandler, object, spec} = this.props;
        let options = spec.options.map((opt, idx) => {
            return <option key={idx} value={opt.value}>{opt.label}</option>;
        });

        return (
            <div>
                <div>
                    <span>{spec.label}</span>
                    <select value={object[spec.attr]}
                            onChange={changeHandler.bind(this, object, spec.attr, spec.attrType)}>
                        {options}
                    </select>
                </div>
            </div>
        );
    }
}


Select.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    spec: PropTypes.shape({
        label: PropTypes.string.isRequired,
        attr: PropTypes.string.isRequired,
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
