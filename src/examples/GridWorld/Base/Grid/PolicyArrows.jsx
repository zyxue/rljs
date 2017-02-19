import React, { Component, PropTypes } from 'react';

import PolicyArrow from './PolicyArrow.jsx';


class PolicyArrows extends Component {
    propTypes: {
        arrowHeadDefId: PropTypes.string
    }

    calcMinQ(Q) {
        let minQ = null;
        for (let a in Q) {
            if (minQ === null) {
                minQ = Q[a];
            } else {
                if (Q[a] < minQ) minQ = Q[a];    
            }
        }
       return minQ;
    }

    normalizeQ(Q) {
        const minQ = this.calcMinQ(Q);
        const normedQ = {};
        for (let i in Q) {
            if (Q.hasOwnProperty(i)) normedQ[i] = Q[i] - minQ;
        }
        return normedQ;
    }

    sumQ(Q) {
        let qSum = 0;
        for (let i in Q) {
            if (Q.hasOwnProperty(i)) qSum += Q[i];
        }
        return qSum;
    }

    render() {
        const {Q, coords} = this.props.state;
        const arrowHeadDefId = this.props.arrowHeadDefId;

        const cellHeight = coords.ymax - coords.ymin;
        const cellWidth = coords.xmax - coords.xmin;
        const maxH = cellWidth / 2;
        const maxV = cellHeight / 2;

        const normedQ = this.normalizeQ(Q);
        const normedQSum = this.sumQ(normedQ);

        const arrows = Object.keys(normedQ).map(function(action, idx) {
            let ratio = (normedQSum > 0) ? (normedQ[action] / normedQSum) : 0;
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
                    strokeWidth={Math.pow(1 + ratio, 2)}
                    arrowHeadDefId={arrowHeadDefId}
                ></PolicyArrow>
            );
        });
        return (
            <g>{arrows}</g>
        );
    }
}

export default PolicyArrows;
