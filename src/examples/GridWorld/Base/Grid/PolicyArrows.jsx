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
        const {Q, coords, cellHeight, cellWidth, allowedActions} = this.props.state;
        const arrowHeadDefId = this.props.arrowHeadDefId;
        const maxH = cellWidth / 2;
        const maxV = cellHeight / 2;

        const normedQ = this.normalizeQ(Q);
        const normedQSum = this.sumQ(normedQ);

        // implicit problem, needs further debugging to see how the type casting
        // works in javascript. action is a Number or String?

        // const arrows = Object.keys(normedQ).map(function(action, idx) {
        // console.log(Object.keys(normedQ));
        const arrows = allowedActions.map(function(action, idx) {
            const ratio = (normedQSum > 0) ? normedQ[action] / normedQSum : 0;
            let nx, ny;
            if (action === 0) {nx = - maxH * ratio; ny = 0;}
            if (action === 1) {nx = 0; ny = - maxV * ratio;}
            if (action === 2) {nx = maxH * ratio; ny = 0;}
            if (action === 3) {nx = 0; ny = maxV * ratio;}
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
