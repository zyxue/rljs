import React, {Component, PropTypes} from 'react';
import {Col} from 'react-bootstrap';


class NumberInputTag extends Component {
    render () {
        // obj includes information necessary for rendering this component
        // accordingly
        let {objectToUpdate, updateMethod, params, labelNumCols, inputNumCols} = this.props;
        return (
            <div>
                <Col className="nopadding" md={labelNumCols}>
                    <span>{params.label}</span>
                    <span className="text-primary">
                        {params.hideValue ? null : objectToUpdate[params.attr]}
                    </span>
                </Col>
                <Col className="nopadding" md={inputNumCols}>
                    <div>
                        <input type="number" min={params.min} max={params.max} step={params.step}
                               value={objectToUpdate[params.attr]} 
                               onChange={updateMethod.bind(this, params.attr)}/>
                    </div>
                </Col>
            </div>
        );
    }
}

NumberInputTag.propTypes = {
    objectToUpdate: PropTypes.object.isRequired,
    updateMethod: PropTypes.func.isRequired,
    params: PropTypes.shape({
        label: PropTypes.string.isRequired,
        attr: PropTypes.string.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        hideValue: PropTypes.bool,
    }).isRequired,

    // This feels very bad API design
    labelNumCols: PropTypes.number,
    inputNumCols: PropTypes.number,
};

NumberInputTag.defaultProps = {
    labelNumCols: 3,
    inputNumCols: 3,
};


export default NumberInputTag;
