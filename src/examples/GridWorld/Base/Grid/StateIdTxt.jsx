import React, { Component, PropTypes } from 'react';


class StateIdTxt extends Component {
    propTypes: {
        x: PropTypes.number,
        y: PropTypes.number,
        stateId: PropTypes.number
    }

    render() {
        const {x, y, stateId} = this.props;
        return (
                <text x={x} y={y}
                      textAnchor="end"
                      dominantBaseline="text-before-edge"
                      fontSize=".7em" fill="blue">
                    {stateId}
                </text>
        );
    }
}

export default StateIdTxt;
