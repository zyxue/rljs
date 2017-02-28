import React, {Component, PropTypes} from 'react';
import {Col} from 'react-bootstrap';

class SelectTag extends Component {
    render () {
        let {changeHandler, spec, labelNumCols, inputNumCols} = this.props;
        let options = spec.options.map((opt, idx) => {
            return <option key={idx} value={opt.value}>{opt.label}</option>;
        });

        return (
            <div>
                <Col className="nopadding" md={labelNumCols}>
                    <span>{spec.label}</span>
                </Col>
                <Col className="nopadding" md={inputNumCols}>
                    <select value={spec.currentVal}
                            onChange={changeHandler.bind(this, spec.attr)}>
                        {options}
                    </select>
                </Col>
            </div>
        );
    }
}


SelectTag.propTypes = {
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
    }).isRequired,

    // This feels very bad API design
    labelNumCols: PropTypes.number,
    inputNumCols: PropTypes.number
};

SelectTag.defaultProps = {
    labelNumCols: 3,
    inputNumCols: 9
};


export default SelectTag;
