import React, { Component, PropTypes } from 'react';

class StateCoordTxt extends Component {
    propTypes: {
        x: PropTypes.number,
        y: PropTypes.number,
        coordX: PropTypes.number,
        coordY: PropTypes.number
    }

    render() {
        const {x, y, coordX, coordY} = this.props;
        return (
                <text x={x} y={y}
                      textAnchor="start"
                      dominantBaseline="text-before-edge"
                      fontSize=".7em"
                      fill="blue">
                    ({coordX}, {coordY})
                </text>
        );
    }
}


export default StateCoordTxt;
