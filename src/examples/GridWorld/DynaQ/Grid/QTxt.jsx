import React, { Component, PropTypes } from 'react';


class QTxt extends Component {
    render () {
        const {coords, action, qVal} = this.props;
        const qValStr = qVal.toFixed(1);
        const {xmin, ymin,  xmid, ymid, xmax, ymax} = coords;

        if (action === 'left') {
            return (
                <text x={xmin} y={ymid}
                      textAnchor="start"
                      dominantBaseline="central"
                      fontSize=".7em">
                    {qValStr}
                </text>
            )
        } else if (action === 'up') {
            return (
                <text x={xmid} y={ymin}
                      textAnchor="middle"
                      dominantBaseline="text-before-edge"
                      fontSize=".7em">
                    {qValStr}
                </text>
            );
        } else if (action === 'right') {
            return (
                <text x={xmax} y={ymid}
                      textAnchor="end"
                      dominantBaseline="central"
                      fontSize=".7em">
                    {qValStr}
                </text>
            );
        } else if (action === 'down') {
            return (
                <text x={xmid} y={ymax}
                      textAnchor="middle"
                      dominantBaseline="text-after-edge"
                      fontSize=".7em">
                    {qValStr}
                </text>
            );
        }
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
