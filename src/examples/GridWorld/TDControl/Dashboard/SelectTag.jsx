import React, {Component, PropTypes} from 'react';
import {Col} from 'react-bootstrap';

class SelectTag extends Component {
    render () {
        let {objectToUpdate, updateMethod, params, labelNumCols, inputNumCols} = this.props;
        let options = params.options.map((p) => {
            return <option key={params.attr + '-' + p.value} value={p.value}>{p.text}</option>
        });

        return (
            <div>
                <Col className="nopadding" md={labelNumCols}>
                    <span>{params.label}</span>
                </Col>
                <Col className="nopadding" md={inputNumCols}>
                    <select value={objectToUpdate[params.attr]}
                            onChange={updateMethod.bind(this, params.attr)}>
                        {options}
                    </select>
                </Col>
            </div>
        );
    }
}


SelectTag.propTypes = {
    objectToUpdate: PropTypes.object.isRequired,
    updateMethod: PropTypes.func.isRequired,
    params: PropTypes.shape({
        label: PropTypes.string.isRequired,
        attr: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            text: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
        })),
    }).isRequired,

    // This feels very bad API design
    labelNumCols: PropTypes.number,
    inputNumCols: PropTypes.number,
};

SelectTag.defaultProps = {
    labelNumCols: 3,
    inputNumCols: 9,
};


export default SelectTag;
