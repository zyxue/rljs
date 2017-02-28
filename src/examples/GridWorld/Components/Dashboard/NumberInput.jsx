import React, {Component, PropTypes} from 'react';
import {Col} from 'react-bootstrap';


class NumberInputTag extends Component {
    render () {
        // obj includes information necessary for rendering this component
        // accordingly
        let {changeHandler, spec, labelNumCols, inputNumCols} = this.props;
        return (
            <div>
                <Col className="nopadding" md={labelNumCols}>
                    <span>{spec.label}</span>
                    <span className="text-primary">
                        {spec.hideValue ? null : spec.currentVal}
                    </span>
                </Col>
                <Col className="nopadding" md={inputNumCols}>
                    <div>
                        <input type="number" min={spec.min} max={spec.max} step={spec.step}
                               value={spec.currentVal} 
                               onChange={changeHandler.bind(this, spec.attr)}/>
                    </div>
                </Col>
            </div>
        );
    }
}

NumberInputTag.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    spec: PropTypes.shape({
        label: PropTypes.string.isRequired,
        attr: PropTypes.string.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        hideValue: PropTypes.bool
    }).isRequired,

    // This feels very bad API design
    labelNumCols: PropTypes.number,
    inputNumCols: PropTypes.number
};

NumberInputTag.defaultProps = {
    labelNumCols: 3,
    inputNumCols: 3
};


export default NumberInputTag;
