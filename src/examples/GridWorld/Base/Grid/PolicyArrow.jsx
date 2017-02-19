import React, { Component, PropTypes } from 'react';


class PolicyArrow extends Component {
    propTypes: {
        x1: PropTypes.number,
        y1: PropTypes.number,
        x2: PropTypes.number,
        y2: PropTypes.number,
        strokeWidth: PropTypes.number,
        arrowHeadDefId: PropTypes.string
    }

    render() {
        const {x1, y1, x2, y2, strokeWidth, arrowHeadDefId} = this.props;
        if (strokeWidth === 1) {
            return <line></line>;
        } else {
            return (
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="black"
                      strokeWidth={strokeWidth}
                      markerEnd={"url(#" + arrowHeadDefId + ")"}>
                </line>
            );
        }
    }
}

export default PolicyArrow;
