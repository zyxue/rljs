import React, { Component, PropTypes } from 'react';

import PolicyArrow from './PolicyArrow.jsx';


class PiBasedPolicyArrows extends Component {
    propTypes: {
        arrowHeadDefId: PropTypes.string
    }

    render() {
        const {Pi, coords} = this.props.state;
        const arrowHeadDefId = this.props.arrowHeadDefId;

        // scale back a bit, not to hit the cell edge
        const scaler = 0.95;
        const cellHeight = (coords.ymax - coords.ymin) * scaler;
        const cellWidth = (coords.xmax - coords.xmin) * scaler; 
        const maxH = cellWidth / Pi.length;
        const maxV = cellHeight / Pi.length;

        const arrows = Pi.map(function(action, idx) {
            let nx, ny;
            if (action === 'left') {nx = - maxH; ny = 0;}
            if (action === 'up') {nx = 0; ny = - maxV;}
            if (action === 'right') {nx = maxH; ny = 0;}
            if (action === 'down') {nx = 0; ny = maxV;}
            return (
                <PolicyArrow
                    key={idx}
                    x1={coords.xmid}
                    y1={coords.ymid}
                    x2={coords.xmid + nx}
                    y2={coords.ymid + ny}
                    strokeWidth="2"
                    arrowHeadDefId={arrowHeadDefId}
                ></PolicyArrow>
            );
        });
        return (
            <g>{arrows}</g>
        );
    }
}

export default PiBasedPolicyArrows;
