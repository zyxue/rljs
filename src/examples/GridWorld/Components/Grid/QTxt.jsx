import React, { Component, PropTypes } from 'react';


class QTxt extends Component {
    render() {
        const {coords, action, qVal} = this.props;
        const qValStr = qVal.toExponential(1);
        const {xmin, ymin,  xmid, ymid, xmax, ymax} = coords;

        let res;
        if (action === 'left') {
            res = (
                <text x={xmin} y={ymid}
                      textAnchor="middle"
                      dominantBaseline="text-after-edge"
                      writingMode="tb"
                      fontSize=".7em">
                    {qValStr}
                </text>
            );
        } else if (action === 'up') {
            res = (
                <text x={xmid} y={ymin}
                      textAnchor="middle"
                      dominantBaseline="text-before-edge"
                      fontSize=".7em">
                    {qValStr}
                </text>
            );
        } else if (action === 'right') {
            res = (
                <text x={xmax} y={ymid}
                      textAnchor="middle"
                      dominantBaseline="text-before-edge"
                      writingMode="tb"
                      fontSize=".7em">
                    {qValStr}
                </text>
            );
        } else if (action === 'down') {
            res = (
                <text x={xmid} y={ymax}
                      textAnchor="middle"
                      dominantBaseline="text-after-edge"
                      fontSize=".7em">
                    {qValStr}
                </text>
            );
        }
        return res;
    }
}


QTxt.propTypes =  {
    coords: React.PropTypes.shape({
        xmin: PropTypes.number,
        ymin: PropTypes.number,
        xmid: PropTypes.number,
        ymid: PropTypes.number,
        xmax: PropTypes.number,
        ymax: PropTypes.number
    }).isRequired
};



export default QTxt;
