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
        const cellHeight = (coords.ymax - coords.ymin);
        const cellWidth = (coords.xmax - coords.xmin); 
        const scaler = 0.80;
        const maxH = (cellWidth / 2) * scaler;
        const maxV = (cellHeight / 2) * scaler;

        const ratio = 1 / Pi.length;
        const arrows = Pi.map(function(action, idx) {
            let nx, ny;
            if (action === 'left') {nx = - maxH * ratio; ny = 0;}
            if (action === 'up') {nx = 0; ny = - maxV * ratio;}
            if (action === 'right') {nx = maxH * ratio; ny = 0;}
            if (action === 'down') {nx = 0; ny = maxV * ratio;}
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
